import express from "express"
import protectRoute from "../Middleaere/protectRoute.js";
import { GetUserforSidebar } from "../Controllers/user.controller.js";
const router=express.Router();
router.get("/",protectRoute,GetUserforSidebar)
export default router;