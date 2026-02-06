import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface BreathingSession {
    userId: string; // Ideally from Auth, but generating UUID for now
    selectedMinutes: number;
    completed: boolean;
    moodBefore?: number;
    moodAfter?: number;
    timestamp: any; // FieldValue
}

export const saveSession = async (session: Omit<BreathingSession, "userId" | "timestamp">) => {
    try {
        // Generate a temporary user ID if not present (simple persistence for this demo)
        let userId = localStorage.getItem("breathing_user_id");
        if (!userId) {
            userId = crypto.randomUUID();
            localStorage.setItem("breathing_user_id", userId);
        }

        await addDoc(collection(db, "sessions"), {
            ...session,
            userId,
            timestamp: serverTimestamp(),
        });
        console.log("Session saved successfully");
    } catch (error) {
        console.error("Error saving session to Firestore:", error);
        // Silent fail or UI feedback could be added here
    }
};
