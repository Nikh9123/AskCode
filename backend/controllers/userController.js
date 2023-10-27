import User from "../models/UserModel.js";
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

		const userTOFollow = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (!userTOFollow || !currentUser) {
			return res.status(404).json({
				status: "fail",
				message: "User not found",
			});
		}

		// Check if the user is already following the user to follow
		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow: Remove id from following array of currentUser
			currentUser.following = currentUser.following.filter(
				(userId) => userId.toString() !== id
			);

			// Remove req.user._id from followers array of userTOFollow
			userTOFollow.followers = userTOFollow.followers.filter(
				(followerId) => followerId.toString() !== req.user._id
			);

			// Save changes to the database
			await currentUser.save();
			await userTOFollow.save();

			return res.status(200).json({
				status: "success",
				message: "Unfollowed successfully",
			});
		}

		// Follow: Add id to following array of currentUser
		currentUser.following.push(id);
		// Add req.user._id to followers array of userTOFollow
		userTOFollow.followers.push(req.user._id);

		// Save changes to the database
		await currentUser.save();
		await userTOFollow.save();

		return res.status(200).json({
			status: "success",
			message: "Followed successfully",
			data: {
				currentUser,
				userTOFollow,
			},
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({
			status: "error",
			message: "Unable to follow/unfollow. Please try again later.",
		});
	}
};

export { signUp, signIn, signOut, followUnFollow };
