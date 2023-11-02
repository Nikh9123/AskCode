import  express  from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getPost , createPost, deletePost, getAllPosts , getUserFeedPost, likeUnlikePost, replyToPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts)
router.get("/feed", protectRoute, getUserFeedPost);
router.get("/:postId", getPost);


router.use(protectRoute);
router.post("/create", createPost);
router.post("/delete/:postId", deletePost)
router.post("/like/:postId", likeUnlikePost)
router.post("/reply/:postId", replyToPost)


export default router;