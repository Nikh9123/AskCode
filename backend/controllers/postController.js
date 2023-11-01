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
			message: "unable to get posts😞. try after sometime ",
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
			message: "unable to get post😞. try after sometime ",
		});
	}
};

const createPost = async (req, res) => {
	try {
		const { postedBy, text, img, errorDisc } = req.body;
		console.log(req.body);

		//check if user is valid
		if (postedBy !== req.user._id.toString()) {
			return res.status(401).json({
				status: "fail",
				message: "invalid user",
			});
		}

		//check if all fields are filled
		if (!postedBy || !text) {
			return res.status(400).json({
				status: "fail",
				message: "please fill all the fields",
			});
		}

		//check if user exists or not
		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(403).json({
				status: "fail",
				message: "user doesn't exists",
			});
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
			message: "unable to post😞. try after sometime ",
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
				message: "post not found",
			});
		}

		const postedBy = post.postedBy.toString();
		console.log(postedBy, "and", userId);

		if (postedBy !== userId) {
			return res.status(401).json({
				status: "unauthorized",
				message: "you can only delete your post",
			});
		}

		await Post.findByIdAndDelete(postId);
		res.status(204).json({
			status: "success",
			message: "post deleted successfully",
		});
	} catch (err) {
		console.log("error from deletePost : ", err.message);
		res.status(500).json({
			status: "fail",
			message: "unable to delete post. Try again later",
		});
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { postId } = req.params;
		console.log(postId);
		const userId = req.user._id.toString();

		const post = await Post.findById(postId);

		if (!post) {
			res.status(404).json({
				status: "fail",
				message: "Post not found",
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
			message: "Failed to like/unlike the post. Please try again later.",
		});
	}
};


export { getAllPosts, getPost, createPost, deletePost, likeUnlikePost };
