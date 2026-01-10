export interface ServerResponse {
    success: boolean;
    message: string;
    data: any
}

export interface User {
    id: string;
    displayName: string;
    email: string,
    createdAt: Date,
    lastLogin: Date,
    status: "online" | "offline" | "matched",
    connectedEmails: string[],
    connectedWith: string | null,
    connectionId: string | null,
    emotionalScore: number,
    emotionalLevel: "Calm" | "Balanced" | "Stressed"
}