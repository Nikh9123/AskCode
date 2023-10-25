import crypto from "crypto";
import jwt from "jsonwebtoken";
import ms from "ms";

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
    
		sendTokenToRes(newUser, 201, "your account was successfully created...",res);
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
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({
				status: "fail",
				message: "please provide email and password",
			});
		}
		// 2) CHECK IF USER EXISTS
		const user = await User.findOne({ email }).select('+password');
		console.log("user  = ",user.password);
		if (!user || !(await user.correctPassword(password, user.password)))
		{
			res.status(401).json({
				status: "fail",
				message: "incorrect email or password",
			});
		}
		sendTokenToRes(user, 200, "you are logged in",res);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "error",
			message: "unable to sign in. please try again later.",
		});
	}
};
export { signUp, signIn };