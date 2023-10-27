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
		},
		passwordConfirm: {
			type: String,
			// required: [true, "please enter your password again"],
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
userSchema.pre("save", async function (next) {
	//ONLY RUN FUNCTION IF PASSWORD ACTUALLY MODIFIED
	if (!this.isModified("password")) return next();

	//HASH PASSWORD WITH COST
	this.password = await bcrypt.hash(this.password, 14);

	//DELETE PASSWORD CONFIRm
	this.passwordConfirm = undefined;
	next();
});

//this middleware will check wether the passowrd entered by user is correct(password entered by user is encrypted and then compared with the password stored in database) if not then it will return false
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	// return true if password is correct
	return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
