import crypto from "crypto";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import ms from "ms";

//CREATING JWT TOKEN FOR USER
const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

//SEND TOKEN TO BROWSER AND RESPONSE
const sendTokenToRes = (user, statusCode, res) => {
	console.log(user._id);
	const { _id } = user;
	console.log(_id);
	const token = signToken(user._id);
	console.log(token);
	const expirationDate = new Date(Date.now() + ms(process.env.JWT_EXPIRE));

	const cookieOptions = {
		// Set the 'expires' option
		expires: expirationDate,
		httpOnly: true,
	};

	res.cookie("jwt", token, cookieOptions);
	user.password = undefined;
	res.status(statusCode).json({
		status: "your account was successfully created...",
		data: {
			user,
			token,
		},
	});
};

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

		sendTokenToRes(newUser, 201, res);
	} catch (err) {
		res.status(500).json({
			status: "error",
			message: err.message,
		});
		console.log("error in signup controller", err.message);
	}
};


export { signUp}