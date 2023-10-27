import express from "express";

import {followUnFollow, signIn, signOut, signUp} from '../controllers/userController.js'
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
// router.post("/signin",signIn) ;
router.get("/signout", signOut);
router.post("/follow/:id",protectRoute, followUnFollow);

export default router;
