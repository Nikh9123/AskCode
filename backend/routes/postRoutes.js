import  express  from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createPost, getAllPosts } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts)


router.use(protectRoute);
router.post("/create", createPost);


export default router;