import { Router } from "express";
import { startConversation } from "../controllers/chat"; 

const router = Router();

router.get("/chat", getOldConversation);
router.post("/chat/message", chatController);
router.post("/chat/new", createNewSession);
router.get("/chat/:userId", getOldSessions);

export default router;
