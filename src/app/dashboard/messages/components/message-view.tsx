import { Conversation } from "@/lib/definitions"
import { MessageHeader } from "./message-header"
import { ScrollArea } from "@/lib/ui/scroll-area"
import { MessageInput } from "./message-input"
import { MessageBubble } from "./message-bubble"

interface MessageViewProps {
   conversation: Conversation
 }
 
 export function MessageView({ conversation }: MessageViewProps) {
   const handleSendMessage = (message: string) => {
     // Handle sending message
     console.log("Sending message:", message)
   }
 
   return (
     <div className="flex-1 flex flex-col">
       <MessageHeader conversation={conversation} />
       <ScrollArea className="flex-1 p-4 bg-white">
         <div className="space-y-4">
           {conversation.messages?.map((message) => (
             <MessageBubble key={message.id} message={message} />
           ))}
         </div>
       </ScrollArea>
       <MessageInput onSendMessage={handleSendMessage} />
     </div>
   )
 }