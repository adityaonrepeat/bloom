import { Router } from "express";
import { chatController, getOldConversation, getOldSessions, createNewSession } from "../controllers/chat";

const router = Router();

router.get("/chat", getOldConversation);
router.post("/chat/message", chatController);
router.post("/chat/new", createNewSession);
router.get("/chat/:userId", getOldSessions);

export default router;
