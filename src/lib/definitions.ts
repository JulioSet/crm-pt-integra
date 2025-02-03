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

export type MessageStatus = "new" | "hot" | "cold" | "deal" | "ongoing" | "resolved"
export type MessagePriority = "high" | "medium" | "low"

export interface Conversation {
  id: string
  name: string
  lastMessage: string
  lastMessageAt: string
  status: MessageStatus
  priority?: MessagePriority
  labels?: string[]
  note?: string
  messages?: Message[]
}
