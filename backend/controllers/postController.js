import { v2 as cloudinary } from "cloudinary";

import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find({}).populate("postedBy", "name username");
		res.status(200).json({
			status: "success",
			message: "all posts",
			data: posts,
		});
	} catch (err) {
		console.log("error from getAllPosts : ", err.message);
		res.status(400).json({
			status: "fail",
			error: "unable to get posts😞. try after sometime ",
		});
	}
};

const getPost = async (req, res) => {
	const { postId } = req.params;
	try {
		const post = await Post.findById(postId).populate(
			"postedBy",
			"name username"
		);
		res.status(200).json({
			status: "success",
			message: "post fetched successfully",
			data: post,
		});
	} catch (err) {
		console.log("error from getPost : ", err.message);
		res.status(400).json({
			status: "fail",
			error: "unable to get post😞. try after sometime ",
		});
	}
};

const createPost = async (req, res) => {
	try {
		const { postedBy, text, errorDisc } = req.body;
		let { img } = req.body;
		console.log(req.body);

		//check if user is valid
		if (postedBy !== req.user._id.toString()) {
			return res.status(401).json({
				status: "fail",
				error: "invalid user",
			});
		}

		//check if all fields are filled
		if (!postedBy || !text) {
			return res.status(400).json({
				status: "fail",
				error: "please fill all the fields",
			});
		}

		//check if user exists or not
		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(403).json({
				status: "fail",
				error: "user doesn't exists",
			});
		}
		if (img) {
			if (img) {
				if (user.img) {
					await cloudinary.uploader.destroy(
						user.img.split("/").pop().split(".")[0]
					);
				}

				const result = await cloudinary.uploader.upload(img);
				img = result.secure_url;
				console.log(result);
				await User.findByIdAndUpdate(req.user._id, { img: result.secure_url });
			}
		}
		const newPost = new Post({ postedBy, text, img, errorDisc });
		await newPost.save();
		res.status(201).json({
			status: "success",
			message: "post created successfully",
			data: newPost,
		});
	} catch (err) {
		console.log("error from createPost : ", err.message);
		res.status(400).json({
			status: "fail",
			error: "unable to post😞. try after sometime ",
		});
	}
};

const deletePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id.toString();

		//only the person who created the post can delete it
		const post = await Post.findById(postId);
    
		if (!post) {
			res.status(404).json({
				status: "Not found",
				error: "post not found",
			});
		}

		const postedBy = post.postedBy.toString();
		console.log(postedBy, "and", userId);

		if (postedBy !== userId) {
			return res.status(401).json({
				status: "unauthorized",
				error: "you can only delete your post",
			});
		}
    
		if(post.img){
			const imgId = await post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}
		await Post.findByIdAndDelete(postId);
    //send response
		res.status(200).json({
			status:'success',
			message:'post deleted successfully'
		})
		
	} catch (err) {
		console.log("error from deletePost : ", err.message);
		res.status(500).json({
			status: "fail",
			error: "unable to delete post. Try again later",
		});
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id.toString();
		console.log(userId);

		const post = await Post.findById(postId);

		if (!post) {
			res.status(404).json({
				status: "fail",
				error: "Post not found",
			});
		}

		const alreadyLiked = await post.likes.includes(userId);

		if (alreadyLiked) {
			await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
			res.status(200).json({
				status: "success",
				message: "Post unliked successfully",
				data: {
					length: post.likes.length - 1,
					unLikedBy: post.likes.filter((id) => id == userId),
					likedBy: post.likes.filter((id) => id != userId),
				},
			});
		} else {
			await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
			res.status(200).json({
				status: "success",
				message: "Post liked successfully",
				data: {
					length: post.likes.length + 1,
					likedBy: userId,
				},
			});
		}
	} catch (err) {
		console.error("Error from likeUnlikePost: ", err.message);
		res.status(500).json({
			status: "fail",
			error: "Failed to like/unlike the post. Please try again later.",
		});
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const { postId } = req.params;
		const userId = req.user._id.toString();
		const profilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({
				status: "fail",
				error: "please enter text to reply",
			});
		}
		const post = await Post.findById(postId);

		if (!post) {
			res.status(404).json({
				status: "fail",
				error: "post not found",
			});
		}

		const newReply = {
			userId,
			text,
			profilePic,
			username,
		};
		post.replies.push(newReply);
		await post.save();

		res.status(201).json({
			status: "success",
			message: "reply added successfully",
			data: post.replies,
		});
	} catch (err) {
		console.error("Error from replyToPost: ", err.message);
		res.status(500).json({
			status: "fail",
			error: "unable to reply to post. Try again later",
		});
	}
};

const getUserFeedPost = async (req, res) => {
	console.log(req);

	try {
		const userId = req.user._id;
		const user = await User.findById(userId);

		if (!user) {
			res.status(404).json({
				status: "fail",
				error: "user not found",
			});
		}

		//get all the users that the current user is following
		const following = user.following;

		//get all the posts of the users that the current user is following
		const FollowingPosts = await Post.find({
			postedBy: { $in: following },
		}).sort({ createdAt: -1 });

		//get all the users who follows the current user
		const followers = user.followers;

		//get all the posts of the users who follows the current user
		const FollowersPosts = await Post.find({
			postedBy: { $in: followers },
		}).sort({ createdAt: -1 });

		if (!FollowingPosts && !FollowersPosts) {
			return res.status(404).json({
				status: "fail",
				error: "no posts found",
			});
		}

		res.status(200).json({
			status: "success",
			message: "your feed",
			// data: FollowingPosts.concat(FollowersPosts)//this will return an array of concatenated posts of the users that the current user is following and the users who follows the current user
			data: [...FollowingPosts, ...FollowersPosts],
		});
	} catch (error) {
		console.error("Error from getUserFeedPost : ", err.message);
		res.status(500).json({
			status: "fail",
			error: "unable to get your feed. Try again later",
		});
	}
};

const getUserPosts = async (req, res) => {
	//1. get the user id from params
	const { username } = req.params;
	//2. get the user from db
	const user = await User.findOne({ username });
	//3. if Iuser not found then return error
	if (!user) {
		return res.status(404).json({
			status: "fail",
			error: "user not found",
		});
	}

	//4. get the posts of that user
	const posts = await Post.find({ postedBy: user._id }).sort("-createdAt");
		
		if(!posts)
		{
			return res.status(404).json({
				status: "fail",
				error: "no posts found",
			});
		}

	//5. return the posts
	res.status(200).json(posts);
};

export {
	getAllPosts,
	getPost,
	createPost,
	deletePost,
	likeUnlikePost,
	replyToPost,
	getUserFeedPost,
	getUserPosts,
};
