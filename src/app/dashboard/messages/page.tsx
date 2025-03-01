'use client'

import { useEffect, useState } from "react"
import { Conversation } from "@/lib/definitions"
import { MessagesSidebar } from "./components/message-sidebar"
import { MessageView } from "./components/message-view"
import { getConversations } from "@/lib/message"

export default function Messages() {
   const [conversations, setConversations] = useState<Conversation[]>([])
   const [phone, setPhone] = useState("")
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      // fetch conversations
      const fetch = setInterval(async () => {
         const data = await getConversations()
         if (data) {
            setConversations(data)
         }
      }, 1000)
      setLoading(false)
      
      return () => clearInterval(fetch); // Cleanup on unmount
   }, []);

   return(
      <div className="flex h-full bg-background">
         <MessagesSidebar
            conversations={conversations}
            selectedConversation={conversations.find(conversation => conversation.telepon === phone) ?? null}
            onSelectConversation={setPhone}
            loading={loading}
         />
         {conversations.find(conversation => conversation.telepon === phone) ? (
            <MessageView conversation={conversations.find(conversation => conversation.telepon === phone) ?? null} />
         ) : (
            <div className="flex flex-1 items-center justify-center space-y-4 p-4 md:p-8 pt-6 bg-white">
               <p className="text-slate-400">Belum Ada Percakapan yang Terpilih</p>
            </div>
         )}
      </div>
   )
}