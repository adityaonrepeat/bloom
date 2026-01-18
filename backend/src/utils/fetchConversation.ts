import { db } from "../config/firebase.config";

export const fetchConversation = async (userId: string, conversationId: string) => {

    try {
        const messagesSnapshot = await db.collection("messages")
            .where("conversationId", "==", conversationId)
            .get();

        if (messagesSnapshot.empty) {
            return {
                success: false,
                message: "There is no previous chat history for this conversation"
            }
        }

        const pastMessages = await Promise.all(
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
                    role: messageData.role,
                    timeStamp: messageData.timeStamp
                };
            })
        );

        const messages = pastMessages.map((msg) => {
            const message = msg.parts.map((prt, i) => {
                return prt.text
            }).join("");

            return { message: message, role: msg.role, timestamp: msg.timeStamp }
        })

        console.log("Returned from db");

        return {
            success: true,
            messages: messages
        };

    } catch (error) {
        throw error;
    }
}