import express from "express";

import {followUnFollow, getProfile, signIn, signOut, signUp, updateMyInformation, updateMyProfile} from '../controllers/userController.js'
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
router.patch("/updateMyProfile/information/:id" ,updateMyInformation )
export default router;
