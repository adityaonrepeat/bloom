import { Router } from "express";
import { logout } from "../controllers/auth";
const router = Router();

router.get("/logout:uid", logout);

export default router;