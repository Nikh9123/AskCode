import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			validate: [validator.isAlpha, "Numbers are not allowed in name"],
			maxLength: [20, "A user name must not be greater than 20 characters"],
			minLength: [3, "A user name must have more or equal then 5 chars"],
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: [true, "A user must have his email id"],
			lowercase: true,
			validate: [validator.isEmail, "Please provide a valid email"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide your password"],
			minLength: [8, "passowrd must be greater than 8 characters"],
		},
		passwordConfirm: {
			type: String,
			required: [true, "please enter your password again"],
			minLength: [6, "passowrd must be greater than 6 characters"],
		},
		profilePic: {
			type: String,
			// required:true
			default: "",
		},
		followers: {
			type: [String],
			default: [],
		},
		following: {
			type: [String],
			default: [],
		},
		bio: {
			type: String,
			default: "",
		},
		createdAT: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);
export default User ;
