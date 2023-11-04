import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
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
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, "please enter your password again"],
			minLength: [6, "passowrd must be greater than 6 characters"],
			validate: {
				validator: function (e) {
					return e == this.password;
				},
				message: "your password and confirm password isn't same",
				select: false,
			},
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
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{
		timestamps: true,
	}
);

// this middleware will run before saving the document to database and hash the password before saving it to database
userSchema.pre('save', async function (next) {
	console.log('Original Password:', this.password);
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 14);
	console.log('Hashed Password:', this.password);
	this.passwordConfirm = undefined;
	next();
});

// this middleware will run before saving the document to database and hash the password before saving it to database
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};


export default mongoose.model("User", userSchema);
