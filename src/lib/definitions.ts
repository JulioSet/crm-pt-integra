export type SessionPayload = {
   name: string;
   role: string;
   expiresAt: Date;
};

export interface Message {
   id: string
   content: string
   sender: "user" | "other"
   timestamp: string
 }
 
 export type MessageStatus = "hot" | "cold" | "deal" | "ongoing"

 export interface Conversation {
   id: string
   name: string
   lastMessage: string
   lastMessageAt: string
   status: MessageStatus
   messages?: Message[]
 }
 