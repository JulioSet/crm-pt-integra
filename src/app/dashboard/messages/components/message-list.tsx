import { Conversation } from "@/lib/definitions"
import { MessageCard } from "./message-card"

interface MessagesListProps {
   conversations: Conversation[]
   onSelectConversation: (conversation: Conversation) => void
 }
 
 export function MessagesList({ conversations, onSelectConversation }: MessagesListProps) {
   return (
     <div className="flex-1 p-4 space-y-4">
       <h1 className="text-2xl font-bold">Recent Messages</h1>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         {conversations.map((conversation) => (
           <MessageCard
             key={conversation.id}
             conversation={conversation}
             onClick={() => onSelectConversation(conversation)}
           />
         ))}
       </div>
     </div>
   )
 }