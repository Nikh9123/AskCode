import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("postedBy", "name username");
    res.status(200).json({
      status: "success",
      message: "all posts",
      data: posts,
    });
  } catch (err) {
    console.log("error from getAllPosts : ", err.message);
    res.status(400).json({
      status: "fail",
      message: "unable to get posts😞. try after sometime ",
    });
  }
};

const createPost = async (req, res) => {
	try {
		const {postedBy, text , img, errorDisc} = req.body;
    console.log(req.body);
    
    //check if user is valid
    console.log(postedBy,"and",req.user._id.toString());
    if(postedBy !== req.user._id.toString()){
      return res.status(401).json({
        status: "fail",
        message: "invalid user",
      });
    }
    
    //check if all fields are filled
    if(!postedBy || !text ){
      return res.status(400).json({
        status: "fail",
        message: "please fill all the fields",
      });
    }
    
    //check if user exists or not
    const user = await User.findById(postedBy);
    if(!user)
    {
      return res.status(403).json({
        status: "fail",
        message: "user doesn't exists",
      });
    }
    
    const newPost = new Post({postedBy, text , img, errorDisc});
    await newPost.save();
    res.status(201).json({
      status: "success",
      message: "post created successfully",
      data: newPost,
    });

	} catch (err) {
		console.log("error from createPost : ", err.message);
		res.status(400).json({
			status: "fail",
			message: "unable to post😞. try after sometime ",
		});
	}
};

export { getAllPosts, createPost };
