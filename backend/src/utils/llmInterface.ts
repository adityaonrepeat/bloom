import { type Content } from "@google/genai";
import { db } from "../config/firebase.config";
import { createConversation } from "./conversation";


export const generateReply = async (userId: string, msg: string, sessionId: string) => {
    
    try {
        let result;
        
        const messagesSnapshot = await db.collection("messages")
            .where("conversationId", "==", sessionId)
            .get();

        // If the conversation is new
        if (messagesSnapshot.empty) {
            result = await createConversation(userId, msg, sessionId, []);
        } else {
            // If its a continuation of an old conversation
            const oldConversation: Content[] = await Promise.all(
                messagesSnapshot.docs.map(async (doc) => {
                    const messageData = doc.data();
                    
                    // Fetch parts for this message
                    const partsSnapshot = await db.collection("parts")
                        .where("messageId", "==", doc.id)
                        .orderBy("order", "asc")
                        .get();
                    
                    const parts = partsSnapshot.docs.map(partDoc => ({
                        text: partDoc.data().text
                    }));
                    
                    return {
                        parts: parts,
                        role: messageData.role
                    };
                })
            );

            result = await createConversation(userId, msg, sessionId, oldConversation);
        }

        return result;
    } catch (error) {
        throw error;
    }
}