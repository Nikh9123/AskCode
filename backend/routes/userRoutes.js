import express from "express";

import {signIn, signOut, signUp} from '../controllers/userController.js'

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin",signIn) ;
router.get("/signout", signOut);
export default router;
