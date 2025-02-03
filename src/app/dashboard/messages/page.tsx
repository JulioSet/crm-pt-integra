'use client'

import { useState } from "react"
import { Conversation } from "@/lib/definitions"
import { useConversations } from "@/hooks/use-conversations"
import { MessagesSidebar } from "./components/message-sidebar"
import { MessagesList } from "./components/message-list"
import { MessageView } from "./components/message-view"

export default function Messages() {
   const { conversations } = useConversations()
   const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

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
            // <MessagesList 
            //    conversations={conversations}
            //    onSelectConversation={setSelectedConversation}
            // />
            <div className="flex flex-1 items-center justify-center space-y-4 p-4 md:p-8 pt-6 bg-white">
               <p className="text-slate-400">Belum Ada Percakapan yang Terpilih</p>
            </div>
         )}
      </div>
   )
}