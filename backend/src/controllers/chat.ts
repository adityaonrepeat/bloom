import type { Request, Response } from "express";
import { generateReply } from "../utils/llmInterface";
import { fetchConversation } from "../utils/fetchConversation";
import { ApiError } from "@google/genai";
import { newMessageInput, fetchConversationInput, userIdSchema } from "../types/zodSchema";
import { db } from "../config/firebase.config";

export const chatController = async (req: Request, res: Response) => {
    const parsedInput = newMessageInput.safeParse(req.body);
    console.log(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({ message: "Invalid input!", error: JSON.parse(parsedInput.error.message)[0].message });
    }
    try {

        if (parsedInput.data.message.length === 0) {
            return res.status(400).json({ message: "Please enter your prompt!", error: "Empty message field!" });
        }

        if (parsedInput.data.userId) {
            if (parsedInput.data.sessionId) {
                console.log(parsedInput.data.sessionId);
                if (parsedInput.data.sessionId.length !== 0) {
                    const llmResponse = await generateReply(parsedInput.data.userId, parsedInput.data.message, parsedInput.data.sessionId);
                    return res.status(200).json({ reply: llmResponse?.reply, timestamp: llmResponse?.timestamp, role: llmResponse?.role });
                }
                return res.status(400).json({ message: "Please enter your prompt!", error: "Empty sessionId field!" });
            }

            const newConversationRef = db.collection('conversations').doc();
            await newConversationRef.set({
                userId: parsedInput.data.userId,
                createdAt: new Date()
            });

            const llmResponse = await generateReply(parsedInput.data.userId, parsedInput.data.message, newConversationRef.id);
            res.status(200).json({ reply: llmResponse?.reply, timestamp: llmResponse?.timestamp, role: llmResponse?.role, userId: `user-session:${llmResponse?.sessionId}` });
        } else {
            const newUserRef = db.collection('users').doc();
            await newUserRef.set({
                createdAt: new Date()
            });

            const newConversationRef = db.collection('conversations').doc();
            await newConversationRef.set({
                userId: newUserRef.id,
                createdAt: new Date()
            });

            const llmResponse = await generateReply(newUserRef.id, parsedInput.data.message, newConversationRef.id);
            res.status(200).json({ reply: llmResponse?.reply, timestamp: llmResponse?.timestamp, role: llmResponse?.role, userId: `${newUserRef.id}:${llmResponse?.sessionId}` });
        }
    } catch (error) {
        console.error(error);

        if (error instanceof ApiError) {
            if (error.status === 400) {
                return res.status(error.status).json({ message: "The request body is malformed or This free tier is not available in your country." });
            }
            if (error.status === 403) {
                return res.status(error.status).json({ message: "The server API key doesn't have the required permissions." });
            }
            if (error.status === 404) {
                return res.status(error.status).json({ message: "The requested resource wasn't found." });
            }
            if (error.status === 429) {
                return res.status(error.status).json({ message: "You've exceeded the rate limit." });
            }
            if (error.status === 500) {
                return res.status(error.status).json({ message: "An unexpected error occurred on LLM's side." });
            }
            if (error.status === 503) {
                return res.status(error.status).json({ message: "The service may be temporarily overloaded or down." });
            }
            if (error.status === 504) {
                return res.status(error.status).json({ message: "The service is unable to finish processing within the deadline." });
            }
        }

        return res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getOldConversation = async (req: Request, res: Response) => {
    const parsedInput = fetchConversationInput.safeParse(req.query);

    if (!parsedInput.success) {
        return res.status(400).json({ message: "Invalid Input!", error: JSON.parse(parsedInput.error.message)[0].message });
    }

    try {
        const result = await fetchConversation(parsedInput.data.userId, parsedInput.data.conversationId);
        if (!result.success) {
            return res.status(404).json({ success: result.success, message: result.message });
        }
        res.status(200).json({ success: result.success, chatHistory: result.messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}

export const getOldSessions = async (req: Request, res: Response) => {

    const parsedInput = userIdSchema.safeParse(req.params);

    if (!parsedInput.success) {
        return res.status(400).json({ message: "Invalid Input!", error: JSON.parse(parsedInput.error.message)[0].message })
    }

    try {
        const conversationsSnapshot = await db.collection('conversations')
            .where('userId', '==', parsedInput.data.userId)
            .get();

        if (conversationsSnapshot.empty) {
            return res.status(404).json({ message: "No previous sessions found for the given userId" });
        }

        const conversationIds = conversationsSnapshot.docs.map(doc => ({
            id: doc.id
        }));

        res.status(200).json({ sessionIds: conversationIds });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}

export const createNewSession = async (req: Request, res: Response) => {
    const parsedInput = userIdSchema.safeParse(req.body);

    if (!parsedInput.success) {
        return res.status(400).json({ message: "Invalid Input!", error: JSON.parse(parsedInput.error.message)[0].message })
    }

    try {
        const newConversationRef = db.collection('conversations').doc();
        await newConversationRef.set({
            userId: parsedInput.data.userId,
            createdAt: new Date()
        });

        res.status(200).json({ sessionId: newConversationRef.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}