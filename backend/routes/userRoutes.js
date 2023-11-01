import express from "express";

import {followUnFollow, getProfile, signIn, signOut, signUp, resetMyEmailPassword, updateMyProfile} from '../controllers/userController.js'
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin",signIn) ;
router.get("/signout", signOut);
router.get("/profile/:username", getProfile)

router.use(protectRoute);
//protect all the routes after this middleware
router.post("/follow/:id", followUnFollow);
router.patch("/updateMyProfile/:id",updateMyProfile )
router.patch("/updateMyProfile/information/:id" ,resetMyEmailPassword )//bana nahi hai krna hai
export default router;
