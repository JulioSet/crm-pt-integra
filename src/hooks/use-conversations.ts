"use client"

import { useState, useEffect } from "react"
import { Conversation } from "@/lib/definitions"
import { getConversations } from "@/lib/data"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    setConversations(getConversations())
  }, [])

  return { conversations }
}