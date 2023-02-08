import express from "express";
import { createChat, userChat, findChat, removeChat } from "../Controllers/ChatController.js";


const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChat);
router.get("/find/:firstId/:secondId", findChat);
router.delete("/:id", removeChat);

export default router;