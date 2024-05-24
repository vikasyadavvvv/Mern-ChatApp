import express from "express";
import { Login, Logout, Signup } from "../Controllers/auth.controller.js";
const router=express.Router();
router.post("/signup",Signup)
router.post("/login" , Login)
router.post("/logout",Logout)

export default router;