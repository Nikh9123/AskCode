import {v2 as cloudinary} from "cloudinary";


import User from "../models/userModel.js";
import { sendTokenToRes } from "../utils/helper/jwtToken.js";
import Email from "../utils/email.js";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

const signUp = async (req, res) => {
	console.log(req.body);

	try {
		const { name, username, email, password, passwordConfirm, bio } = req.body;
		const user = await User.findOne({ $or: [{ email }, { username }] });
		if (!name || !username || !email || !password || !passwordConfirm) {
			return res.status(400).json({
				status: "fail",
				error: "please fill all the fields",
			});
		}
		if(password !== passwordConfirm){
			return res.status(400).json({
				status: "fail",
				error: "password and confirm password should be same",
			});
		}
		if (user) {
			return res.status(400).json({
				status: "fail",
				error:
					"user already exists...! please try again with another email or username",
			});
		}

		const newUser = await User.create({
			name,
			username,
			email,
			password,
			passwordConfirm,
			bio,
		});
		const url = `${req.protocol}://${req.get("host")}/profile/${
			newUser.username
		}`;
		console.log("url : ", url);
		await new Email(newUser, url).sendWelcome();
		sendTokenToRes(
			newUser,
			201,
			"your account was successfully created...",
			res
		);
	} catch (err) {
		console.log("error in signup controller", err.message);

		res.status(500).json({
			status: "error",
			error: "unable to create account. please try again later.",
		});
	}
};

const signIn = async (req, res) => {
	try {
		const { email, username, password } = req.body;

		if (!password || !username) {
			return res.status(400).json({
				status: "fail",
				error: "Please provide all the fields",
			});
		}
    if(password.length < 8){
			return res.status(400).json({
				status: "fail",
				error: "password must be greater than 8 characters",
			});		
		}
		const user = await User.findOne({ username }).select("+password");

		if (!user) {
			return res.status(401).json({
				status: "fail",
				error: "Incorrect username",
			});
		}

		if (!(await user.correctPassword(password, user.password))) {
			return res.status(401).json({
				status: "fail",
				error: "Incorrect password",
			});
		}

		sendTokenToRes(user, 200, "You are logged in", res);
	} catch (err) {
		console.error("Error from signIn:", err.message);
		return res.status(500).json({
			status: "error",
			error: "Please check your username or password and try again",
		});
	}
};


const signOut = async (req, res) => {
	try {
		console.log("signout");
		res.cookie("jwt", "you are loggigng out", {
			expires: new Date(Date.now() + 10 * 1000),
			httpOnly: true,
		});

		res.status(200).json({
			status: "success",
		});
	} catch (err) {
		res.status(500).json({
			status: "error",
			error: "unable to sign out. please try again later.",
		});
	}
};

const followUnFollow = async (req, res) => {
	try {
		console.log(req.params);
		const { id } = req.params;

		const userTOFollow = await User.findById(id); // user whom i want to follow
		const currentUser = await User.findById(req.user._id); // current user who is logged in

		if (id == req.user._id) {
			return res.status(400).json({
				status: "fail",
				error: "You cannot follow/unfollow yourself",
			});
		}

		if (!userTOFollow || !currentUser) {
			return res.status(404).json({
				status: "fail",
				error: "User not found",
			});
		}

		// Check if the user is already following the user to follow
		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			//unfollow user

			// Unfollow: Remove id from following array of currentUser
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

			// Remove req.user._id from followers array of userTOFollow
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			return res.status(200).json({
				status: "success",
				message: "Unfollowed successfully",
			});
		} else {
			// Add req.user._id to followers array of userTOFollow
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

			// Follow: Add id to following array of currentUser

			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Save changes to the database

			return res.status(200).json({
				status: "success",
				message: "Followed successfully",
				data: {
					currentUser,
					userTOFollow,
				},
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: "error",
			error: "Unable to follow/unfollow. Please try again later.",
		});
	}
};

const updateMyProfile = async (req, res) => {
	//we will update the user's name , username , password , email, bio , profilePic
	try {
		const { name, username, bio , email} = req.body;
		let { profilePic } = req.body;
		//current logged in user id
		if (req.params.id != req.user._id) {
			return res.status(400).json({
				status: "fail",
				error: "you can only update your profile",
			});
		}

		if (!name && !username && !bio && !profilePic && !email) {
			return res.status(400).json({
				status: "fail",
				error: "please provide filed to update",
			});
		}

    const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({
				status: "fail",
				error: "user not found",
			});
		}
		// if (name || username || bio || profilePic || email) {
		// 		if(name === user.name || username === user.username || bio === user.bio || profilePic === user.profilePic || email === user.email)
		// 		{
		// 			return res.status(400).json({
		// 				status: "fail",
		// 				error: "please provide filed to update",
		// 			});
		// 		}
		// 	}
      console.log(req.body)
			if (name) {
				await User.findByIdAndUpdate(req.user._id, { name });
			}
			if (username) {
				console.log("username",username)
				await User.findByIdAndUpdate(req.user._id,{$set: { username }});
			}
			if (bio) {
				await User.findByIdAndUpdate(req.user._id, { bio });
			}
			if(email)
			{
				console.log("email",email)
				await User.findByIdAndUpdate(req.user._id,{$set: { email }});
			}
			
			//* uploading profile pic to cloudinary
			if(profilePic)
			{
				if (user.profilePic) {
					await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
				}
				
				const result = await cloudinary.uploader.upload(profilePic);
				profilePic = result.secure_url; 
				console.log(result);
				await User.findByIdAndUpdate(req.user._id, { profilePic: result.secure_url });
			}
			
      const newUser = await User.findById(req.user._id);
			return res.status(200).json({
				status: "success",
				message: "your profile was successfully updated",
				data: {
					newUser,
				},
			});
		}
	catch (err) {
		console.log("error from updateMyProfile : ", err);
		res.status(500).json({
			status: "error",
			error: "unable to update your profile. please try again later.",
		});
	}
};

const getProfile = async (req, res) => {
	/* 
		we will get the user's name , username , email, bio , profilePic
		*/
		// we will fetchuser by either id or username which is query
		const { query } = req.params;
		if (!query) {
			return res.status(400).json({
				status: "fail",
				error: "please provide username",
			});
		}
	try {
    let user ;
		if(mongoose.Types.ObjectId.isValid(query))
		{
			user = await User.findById({_id : query}).select("-password").select('-updatedAt');
		}
		else{
			user = await User.findOne({username : query}).select("-password").select('-updatedAt');
		}

		if (!user) {
			return res.status(404).json({
				status: "fail",
				error: "user not found",
			});
		}
		user.password = undefined;
		return res.status(200).json({
			status: "success",
			message: "profile fetched successfully",
			data: {
				user
			},
		});
	} catch (err) {
		console.log("error from getProfile", err.message);
		res.status(500).json({
			status: "error",
			error: "unable to get profile. please try again later.",
		});
	}
};


const forgotPassword = async (req, res) => {
	//& bana nahi hai krna hai
	res.status(400).json({
		status: "success",
		error: "Not implemented yet",
	});
};

//update the email and password using send token double authentication
const resetMyEmailPassword = async (req, res) => {
	//& bana nahi hai krna hai

	//generate the hashed token which user will enter to change the email and password
	res.status(400).json({
		status: "success",
		error: "Not implemented yet",
	});
};

export {
	signUp,
	signIn,
	signOut,
	followUnFollow,
	updateMyProfile,
	resetMyEmailPassword,
	getProfile,
};
