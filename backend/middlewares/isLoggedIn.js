import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const isLoggedin = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // Verification of Token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_TOKEN_SECRET
      );

      // Check If User Exists
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "User not found",
        });
      }

      // Check If User Password Changed After The Token Was Issued
      // if (user.changedPasswordAfter(decoded.iat)) {
      //   return res.status(401).json({
      //     status: "Unauthorized",
      //     message: "Password changed. Please log in again.",
      //   });
      // }

      // There is a logged-in user, passing data to Pug template
      res.locals.user = user;
    }

    // Call next() outside of the if block to ensure it's called in all cases
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      status: "Unauthorized",
      message: "You are not logged in",
    });
  }
};

export { isLoggedin };