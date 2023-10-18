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

export const signUp = async (req, res) => {
	console.log(req.body);
	const newUser = await User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		bio: req.body.bio,
	});
	sendTokenToRes(newUser, 201, res);
};
