import  express  from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getPost , createPost, deletePost, getAllPosts , getUserFeedPost, getUserPosts, likeUnlikePost, replyToPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts)
router.get("/feed", protectRoute, getUserFeedPost);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);

router.use(protectRoute);

router.post("/create", createPost);
router.delete("/delete/:postId", deletePost)
router.put("/like/:postId", likeUnlikePost)
router.put("/reply/:postId", replyToPost)


export default router;