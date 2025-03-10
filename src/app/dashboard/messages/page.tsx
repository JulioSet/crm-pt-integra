'use client'

import { useEffect, useState } from "react"
import { Conversation } from "@/lib/definitions"
import { MessagesSidebar } from "./components/message-sidebar"
import { MessageView } from "./components/message-view"
import useChatStore from "@/store/chatStore"

export default function Messages() {
   const { data, fetchData, loading } = useChatStore();
   const [conversations, setConversations] = useState<Conversation[]>([])
   const [phone, setPhone] = useState("")

   useEffect(() => {
      // fetch conversations
      fetchData()
      setConversations(data)
   }, [fetchData, data]);

   // for one time use from notifcation and contact redirect
   useEffect(() => {
      if (typeof window !== "undefined") {
         const telepon = localStorage.getItem("telepon") || "";
         setPhone(telepon);
      }
   }, [])

   useEffect(() => {
      if (phone !== "") {
         localStorage.removeItem("telepon")
      }
   }, [phone])

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