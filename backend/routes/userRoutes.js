import express from "express";

import {followUnFollow, getProfile, signIn, signOut, signUp, resetMyEmailPassword, updateMyProfile} from '../controllers/userController.js'
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin",signIn) ;
router.get("/signout", signOut);
router.get("/profile/:query", getProfile)

router.use(protectRoute);
//protect all the routes after this middleware
router.post("/follow/:id", followUnFollow);
router.put("/updateMyProfile/:id",updateMyProfile )
export default router;
