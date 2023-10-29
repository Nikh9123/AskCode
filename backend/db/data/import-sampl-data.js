import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../../models/userModel.js";
import Post from "../../models/postModel.js";

import users from "./userSample.js";

dotenv.config({ path: "../../config.env" });

const db = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
console.log(db);

mongoose
	.connect(db, {
		
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB connection successful");
	});

const importData = async () => {
	try {
		await User.create(users);
		console.log("Data successfully loaded");
		process.exit();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

if(process.argv[2] == '--import')
{
  importData();
}

