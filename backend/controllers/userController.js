import crypto from "crypto";
import User from "../models/UserModel.js";

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

	res.status(200).json({
		message: "your account created successfully...",
		data: {
			newUser,
		},
	});
};
