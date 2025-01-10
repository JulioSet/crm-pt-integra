import { Phone, Video } from "lucide-react"
import { Button } from "../../../../lib/ui/button"
import { Conversation } from "@/lib/definitions"

interface MessageHeaderProps {
   conversation: Conversation
 }
 
export function MessageHeader({ conversation }: MessageHeaderProps) {
   return (
     <div className="border-b p-4 flex items-center justify-between bg-white">
       <div className="flex items-center space-x-4">
         <div>
           <h2 className="font-semibold text-foreground">{conversation.name}</h2>
         </div>
       </div>
       <div className="flex space-x-2">
         <Button variant="ghost" size="icon">
           <Phone className="h-4 w-4" />
         </Button>
         <Button variant="ghost" size="icon">
           <Video className="h-4 w-4" />
         </Button>
       </div>
     </div>
   )
}