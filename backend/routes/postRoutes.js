import  express  from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createPost, deletePost, getAllPosts, getPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts).get("/:postId", getPost);


router.use(protectRoute);
router.post("/create", createPost);
router.post("/delete/:postId", deletePost)


export default router;