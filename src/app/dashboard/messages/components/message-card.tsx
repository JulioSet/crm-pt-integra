import { Card, CardContent, CardFooter, CardHeader } from "@/lib/ui/card"
import { Button } from "../../../../lib/ui/button"
import { Conversation } from "@/lib/definitions"
import { formatDistanceToNow } from "date-fns"

interface MessageCardProps {
   conversation: Conversation
   onClick: () => void
}

export function MessageCard({ conversation, onClick }: MessageCardProps) {
   return (
      <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onClick}>
         <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex-1">
               <h3 className="font-semibold">{conversation.name}</h3>
               <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
               </p>
            </div>
         </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{conversation.lastMessage}</p>
         </CardContent>
         <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
               View Conversation
            </Button>
         </CardFooter>
      </Card>
   )
}