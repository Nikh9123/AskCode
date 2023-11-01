import  express  from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createPost, deletePost, getAllPosts, getPost , getUserFeedPost, likeUnlikePost, replyToPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts).get("/:postId", getPost);


router.use(protectRoute);
router.post("/feed", getUserFeedPost);
router.post("/create", createPost);
router.post("/delete/:postId", deletePost)
router.post("/like/:postId", likeUnlikePost)
router.post("/reply/:postId", replyToPost)


export default router;