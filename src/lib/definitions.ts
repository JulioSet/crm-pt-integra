export type SessionPayload = {
  id: string;
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
  bala_bantuan: string
  deadline: string
  baca: boolean | null
  waktu_admin_delegasi: string | null
  waktu_resolusi: string | null
  message_content: Message[]
}

export interface Message {
  id: number
  message_header_telepon: string
  pesan: string
  waktu: string
  waktu_respon: string
  agent: string
  responder: string
}

export type MessageLabel = "new" | "hot" | "cold" | "deal" | "ongoing" | "resolved"
export type MessagePriority = "high" | "medium" | "low"

export interface Employee {
  id: string
  name: string
  email: string
  role: string
  target_deal: string
}

export interface Contact {
  id: string
  nama: string
  telepon: string
}

export interface Setting {
  name: string
  value: string
}