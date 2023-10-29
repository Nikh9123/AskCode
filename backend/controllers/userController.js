import User from "../models/userModel.js";
import { sendTokenToRes } from "../utils/helper/jwtToken.js";

const signUp = async (req, res) => {
	console.log(req.body);

	try {
		const { name, username, email, password, passwordConfirm, bio } = req.body;
		const user = await User.findOne({ $or: [{ email }, { username }] });
		if (!name || !username || !email || !password || !passwordConfirm) {
			return res.status(400).json({
				status: "fail",
				message: "please fill all the fields",
			});
		}
		if (user) {
			return res.status(400).json({
				status: "fail",
				message:
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

		sendTokenToRes(
			newUser,
			201,
			"your account was successfully created...",
			res
		);
	} catch (err) {
		res.status(500).json({
			status: "error",
			message: err.message,
		});
		console.log("error in signup controller", err.message);
	}
};

const signIn = async (req, res) => {
	try {
		const { email, username, password } = req.body;
		if (!email || !password || !username) {
			res.status(400).json({
				status: "fail",
				message: "please provide email and password",
			});
		}
		// 2) CHECK IF USER EXISTS
		const user = await User.findOne({ email }).select("+password");
		console.log("user  = ", user.password);
		if (!user || !(await user.correctPassword(password, user.password))) {
			res.status(401).json({
				status: "fail",
				message: "incorrect email or password",
			});
		}
		sendTokenToRes(user, 200, "you are logged in", res);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "error",
			message: "unable to sign in. please try again later.",
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
			message: "unable to sign out. please try again later.",
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
				message: "You cannot follow/unfollow yourself",
			});
		}

		if (!userTOFollow || !currentUser) {
			return res.status(404).json({
				status: "fail",
				message: "User not found",
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
			message: "Unable to follow/unfollow. Please try again later.",
		});
	}
};

const updateMyProfile = async (req, res) => {
	//we will update the user's name , username , password , email, bio , profilePic
	const { name, username, bio, profilePic } = req.body;
	try {
		//current logged in user id
		if (req.params.id != req.user._id) {
			return res.status(400).json({
				status: "fail",
				message: "you can only update your profile",
			});
		}

		if (!name && !username && !bio && !profilePic) {
			return res.status(400).json({
				status: "fail",
				message: "please provide filed to update",
			});
		}

		if (name || username || bio || profilePic) {
			const user = await User.findById(req.user._id);
			if (!user) {
				return res.status(404).json({
					status: "fail",
					message: "user not found",
				});
			}
			if (name) {
				await User.findByIdAndUpdate(req.user._id, { name });
			}
			if (username) {
				await User.findByIdAndUpdate(req.user._id, { username });
			}
			if (bio) {
				await User.findByIdAndUpdate(req.user._id, { bio });
			}
			if (profilePic) {
				await User.findByIdAndUpdate(req.user._id, { profilePic });
			}
			return res.status(200).json({
				status: "success",
				message: "your profile was successfully updated",
				data: {
					user,
				},
			});
		}
	} catch (err) {
		console.log("error from updateMyProfile", err);
		res.status(500).json({
			status: "error",
			message: "unable to update your profile. please try again later.",
		});
	}
};

const getProfile = async (req, res) => {
	
		/* 
		we will get the user's name , username , email, bio , profilePic
		*/
	try{
		const { username } = req.params;
		if(!username){
			return res.status(400).json({
				status: "fail",
				message: "please provide username",
			});
		}
	
		const user = await User.findOne({username});
		
		if(!user)
		{
			return res.status(404).json({
				status: "fail",
				message: "user not found",
			});
		}
		return res.status(200).json({
			status: "success",
			message: "profile fetched successfully",
			data: {
				name: user.name,
				username: user.username,
				email: user.email,
				bio: user.bio,
				profilePic: user.profilePic,
			},
		});
	}
	catch(err){
		console.log("error from getProfile", err.message);
		res.status(500).json({
			status: "error",
			message: "unable to get profile. please try again later.",
		});
	}
	
};

//update the email and password using send token double authentication
const updateMyInformation = async (req, res) => {};
export {
	signUp,
	signIn,
	signOut,
	followUnFollow,
	updateMyProfile,
	updateMyInformation,
	getProfile,
};
