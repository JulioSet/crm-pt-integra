import { getSession } from "@/lib/session";
import { JWTPayload } from "jose";

let globalSession: JWTPayload | null = null; // Explicitly type the globalSession variable

export const setGlobalSession = async (): Promise<void> => {
   const session = await getSession(); // Retrieve the session
 
   // Check if the session is valid (not 403 or undefined)
   if (session && session !== 403) {
     globalSession = session as JWTPayload; // Set the global session if valid
   } else {
     globalSession = null; // Set to null if session is invalid (403 or undefined)
   }
 };
 
 export const getGlobalSession = (): JWTPayload | null => globalSession; // Retrieve the global session