import express from "express";

const app = express();

app.listen(5000, (req, res, err) => {
	if (err) {
		console.log(err);
	}
	console.log("Server is running on port localhost 5000");
});
