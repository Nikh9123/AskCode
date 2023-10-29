import express from "express";

import {followUnFollow, signIn, signOut, signUp, updateMyInformation, updateMyProfile} from '../controllers/userController.js'
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin",signIn) ;
router.get("/signout", signOut);

router.use(protectRoute);
//protect all the routes after this middleware
router.post("/follow/:id", followUnFollow);
router.patch("/updateMyProfile",updateMyProfile )
router.patch("/updateMyProfile/information" ,updateMyInformation )
export default router;
