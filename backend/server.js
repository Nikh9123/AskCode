import express from "express";

import dotenv from "dotenv";
import connectDb from "./db/connectDb.js";


const app = express();

dotenv.config({path:'./config.env'})

//connect to mongoDb

connectDb();
const PORT = process.env.PORT || 7000;


app.listen(PORT, (req, res, err) => {
	if (err) {
		console.log(err);
	}
	console.log(`Server is running on localhost ${PORT}`);
});
