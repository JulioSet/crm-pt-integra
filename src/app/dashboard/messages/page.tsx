'use client'

import { useEffect, useState } from "react"
import { Conversation } from "@/lib/definitions"
import { MessagesSidebar } from "./components/message-sidebar"
import { MessageView } from "./components/message-view"
import { getConversations } from "@/lib/message"

export default function Messages() {
   const [conversations, setConversations] = useState<Conversation[]>([])
   const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

   useEffect(() => {
      const fetchData = async () => {
      const data = await getConversations()
      if (data) {
         setConversations(data)
      }
      };
      fetchData();

      const interval = setInterval(fetchData, 5000) // Fetch every 5 seconds
      return () => clearInterval(interval); // Cleanup on unmount
   }, []);

   return(
      <div className="flex h-full bg-background">
         <MessagesSidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
         />
         {selectedConversation ? (
            <MessageView conversation={selectedConversation} />
         ) : (
            <div className="flex flex-1 items-center justify-center space-y-4 p-4 md:p-8 pt-6 bg-white">
               <p className="text-slate-400">Belum Ada Percakapan yang Terpilih</p>
            </div>
         )}
      </div>
   )
}