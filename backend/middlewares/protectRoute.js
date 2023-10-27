import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    console.log("token from protectRoute: ", token)

    if (!token) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "You are not logged in",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

      // Check token expiration
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "Token expired",
        });
      }

      // Find user by ID from the token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          status: "Unauthorized",
          message: "User not found",
        });
      }

      // Add user object to the request object
      req.user = user;
      next();
    } catch (err) {
      // Handle verification errors
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid token",
      });
    }
  } catch (err) {
    console.error("Error from protectRoute: ", err.message);
    res.status(500).json({
      status: "error",
      message: "Unable to authenticate. Please try again later.",
    });
  }
};

export { protectRoute };
