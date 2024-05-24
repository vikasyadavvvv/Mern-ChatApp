import express from 'express'
import { GetMessages, SendMessage } from '../Controllers/message.controller.js';
import protectRoute from '../Middleaere/protectRoute.js';
const router=express.Router();
router.get("/:id", protectRoute,GetMessages)
router.post("/send/:id",protectRoute,SendMessage)

export default router