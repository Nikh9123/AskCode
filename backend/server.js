import dotenv from "dotenv";
import express from "express";
import cokieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

import connectDb from "./db/connectDb.js";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

dotenv.config({path:'./config.env'})
const app = express();



//connect to mongoDb

connectDb();


//connect to cloudinary
cloudinary.config({
	cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
	api_key:process.env.CLOUDINARY_API_KEY,
	api_secret:process.env.CLOUDINARY_SECRET_KEY,
})



const PORT = process.env.PORT || 7000;

app.use(express.json({limit:'50mb'}));// body parser helps to read data from body into req.body

app.use(express.urlencoded({extended:true,limit:'400kb'}))// to read upcomig data from url(user)

app.use(cokieParser());// to read cookies from browser

//routes
app.use('/api/user',userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, (req, res, err) => {
	if (err) {
		console.log(err);
	}
	console.log(`Server is running on localhost ${PORT}`);
});
