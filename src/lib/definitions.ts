export type SessionPayload = {
  name: string;
  role: string;
  expiresAt: Date;
};

export interface Conversation {
  telepon: string
  nama: string | null
  pesan_terbaru: string | null
  waktu_terbaru: string | null
  label: string | null
  prioritas: string | null
  catatan: string | null
  akses: string
  baca: boolean | null
  message_content: Message[]
}

export interface Message {
  id: number
  message_header_telepon: string
  pesan: string
  waktu: string
  responder: string
}

export type MessageLabel = "new" | "hot" | "cold" | "deal" | "ongoing" | "resolved"
export type MessagePriority = "high" | "medium" | "low"

export interface Notification {
  id: string
  sender: string
  message: string
  timestamp: string
  read: boolean
}

export interface Employee {
  id: string
  name: string
}