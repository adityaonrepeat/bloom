import type { Request, Response } from "express";
import { db } from "../config/firebase.config";

export const setEmotionalScore = async (req: Request, res: Response) => {
    const { uid, userScore, emotionalTag }: { uid: string; userScore: number, emotionalTag: string } = req.body;

    if (!uid || !userScore || !emotionalTag) {
        return res.status(400).json({ success: false, message: "Required uid and emotional score" });
    }

    try {
        const userSnap = db.collection("users").doc(uid);
        if (!userSnap) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await userSnap.update({
            emotionalScore: userScore,
            emotionalLevel: emotionalTag
        });

        return res.status(200).json({ success: true, message: "Score set successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
}