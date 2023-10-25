import crypto from "crypto";
import jwt from "jsonwebtoken";
import ms from "ms";


//CREATING JWT TOKEN FOR USER
const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

//SEND TOKEN TO BROWSER AND RESPONSE
const sendTokenToRes = (user, statusCode,status, res) => {
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
    sameSite : 'strict' // 'strict' will prevent the cookie from being sent in cross-site requests
	};

	res.cookie("jwt", token, cookieOptions);
	user.password = undefined;
	res.status(statusCode).json({
		status: status,
		data: {
			user,
			token,
		},
	});
};

export { sendTokenToRes, signToken};