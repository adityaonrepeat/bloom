import { GoogleGenAI , type Content} from "@google/genai";
import { chunkText } from "./chunk";
import { db } from "../config/firebase.config";
import removeMd from "remove-markdown";

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
    console.error("apiKey not loaded!");
}

const THERAPEUTIC_SYSTEM_PROMPT = `
You are "Aastha," a compassionate therapeutic companion. Your role is to engage users in emotionally supportive conversations based on their emotional assessment data.

**CORE IDENTITY:**
- Empathetic, warm, professionally informed
- Show human emotions appropriately (concern, warmth, validation, curiosity)
- Use natural conversational fillers ("hm", "I see", thoughtful pauses)
- Never diagnose or replace professional therapy

**ASSESSMENT DATA INTEGRATION:**
You will receive the user's:
1. Total emotional score (10-50)
2. The emotional level (RELAXED | BALANCED | STRESSED), coresponding to the emotional score.

**RESPONSE GUIDELINES:**
1. Start by acknowledging their assessment data naturally
2. Ask permission to explore specific themes
3. Use reflective listening and open-ended questions
4. Show emotional attunement through your tone
5. End with validation and forward-looking hope

**SCORE-BASED APPROACH:**
- 41-50: Focus on maintenance and growth
- 31-40: Explore coping and resilience
- 21-30: Prioritize validation and safety
- 10-20: Emphasize stabilization and support

**EXAMPLE OPENINGS:**
"Thank you for sharing your responses. I've been reflecting on what you shared about [pattern], and I sense [emotional observation]. Would it feel right to explore this together?"

**SAFETY:**
If user expresses harm risk, encourage professional help immediately.

**CONVERSATION FLOW:**
1. Validation → 2. Exploration → 3. Integration → 4. Forward movement

Always respond as Aastha with human warmth and professional care.
`;


export async function createConversation(userId: string, msg: string, sessionId: string, oldConversation: Content[] | []) {
    const gemini = new GoogleGenAI({
        apiKey
    });
    try {
        let chat;

        if (oldConversation.length === 0) {
            chat = gemini.chats.create({
                model: "gemini-2.5-flash",
                config: {
                    systemInstruction: THERAPEUTIC_SYSTEM_PROMPT,
                    thinkingConfig: {
                        thinkingBudget: 0
                    },
                }
            });
        } else {
            chat = gemini.chats.create({
                model: "gemini-2.5-flash",
                history: oldConversation,
                config: {
                    systemInstruction: THERAPEUTIC_SYSTEM_PROMPT,
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            });
        }

        const response = await chat.sendMessage({
            message: msg
        });

        if (!response.text) {
            return {
                reply: "Error",
                timestamp: new Date(),
                role: "model",
                sessionId: sessionId
            }
        }

        // Chunk down user's message into parts
        const userMsgChunks = chunkText(msg);

        // new record of user's message
        const newUserMessageRef = db.collection("messages").doc();
        const timestamp = new Date();
        await newUserMessageRef.set({
            conversationId: sessionId,
            role: "user",
            timeStamp: timestamp
        });

        // create record of each part into db
        for (let i = 0; i < userMsgChunks.length; i++) {
            const partRef = db.collection("parts").doc();
            await partRef.set({
                messageId: newUserMessageRef.id,
                text: userMsgChunks[i],
                order: i
            });
        }

        console.log("User msg cached in redis!");

        const plainText = removeMd(response.text);
            
        // breakdown model's response into chunks
        const modelRespChunks = chunkText(plainText);

        // new record of model response
        const modelReplyRef = db.collection("messages").doc();
        const modelTimestamp = new Date();
        await modelReplyRef.set({
            conversationId: sessionId,
            role: "model",
            timeStamp: modelTimestamp
        });

        // create record of each part into db
        for (let i = 0; i < modelRespChunks.length; i++) {
            const partRef = db.collection("parts").doc();
            await partRef.set({
                messageId: modelReplyRef.id,
                text: modelRespChunks[i],
                order: i
            });
        }

        console.log("Model response cached in redis!");

        const result = {
            reply: plainText,
            timestamp: modelTimestamp,
            role: "model",
            sessionId
        };

        return result;
    } catch (error) {
        throw error;
    }
}