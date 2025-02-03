import { Conversation, MessagePriority, MessageStatus } from "@/lib/definitions"
import { MessageHeader } from "./message-header"
import { ScrollArea } from "@/lib/ui/scroll-area"
import { MessageInput } from "./message-input"
import { MessageBubble } from "./message-bubble"
import { Button } from "@/lib/ui/button"
import { Label } from "@/lib/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/ui/select"
import { ChevronLeft, ChevronRight, DollarSign, Flag, Flame, Snowflake } from "lucide-react"
import { Card } from "@/lib/ui/card"
import { cn } from "@/utils/class-merger"
import { useState } from "react"
import { Textarea } from "@/lib/ui/textarea"
import { sendMessage } from "@/lib/message"

interface MessageViewProps {
  conversation: Conversation
}

export function MessageView({ conversation }: MessageViewProps) {
  const [status, setStatus] = useState<MessageStatus>(conversation.status)
  const [priority, setPriority] = useState<MessagePriority>(conversation.priority || "medium")
  const [note, setNote] = useState<string>(conversation.note || "")
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  const handleSendMessage = (message: string) => {
    // Handle sending message
    sendMessage('62895396081480', message)
    console.log("Sending message:", message)
  }
  
  const handleStatusChange = (newStatus: MessageStatus) => {
    // Handle status change
    setStatus(newStatus)
    console.log("Status changed to:", newStatus)
  }
  
  const handlePriorityChange = (newPriority: MessagePriority) => {
    // Handle priotity change
    setPriority(newPriority)
    console.log("Priority changed to:", newPriority)
  }
  
  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Handle note change
    setNote(event.target.value)
    console.log("Note updated:", event.target.value)
  }

  return (
    <div className="flex-1 flex">
      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <MessageHeader conversation={conversation} />
        <ScrollArea className="flex-1 p-4 bg-zinc-300">
          <div className="space-y-4">
            {conversation.messages?.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      
      {/* Message Detail - Right Panel */}
      <div className="relative bg-white">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-3 top-4 z-10 h-6 w-6 rounded-full border shadow-md bg-white"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        >
          {isPanelCollapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        <Card 
          className={cn(
            "border-l rounded-none flex flex-col transition-all duration-300",
            isPanelCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-80 opacity-100"
          )}
        >
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <Label className="text-md font-bold">Status</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant={status === "hot" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("hot")}
                  className={cn(
                    "flex justify-start",
                    status === "hot" && "bg-red-500 hover:bg-red-600"
                  )}
                >
                  <Flame className="w-4 h-4 m-2" />
                  Hot Lead
                </Button>
                <Button
                  variant={status === "cold" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("cold")}
                  className={cn(
                    "flex justify-start",
                    status === "cold" && "bg-blue-500 hover:bg-blue-600"
                  )}
                >
                  <Snowflake className="w-4 h-4 m-2" />
                  Cold Lead
                </Button>
                <Button
                  variant={status === "deal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("deal")}
                  className={cn(
                    "flex justify-start",
                    status === "deal" && "bg-green-500 hover:bg-green-600"
                  )}
                >
                  <DollarSign className="w-4 h-4 m-2" />
                  Potential Deal
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority Level
              </Label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="pt-2 pb-2 pr-32">
                    <span className="flex items-center">
                      <Flag className="w-4 h-4 mr-2 text-red-500" />
                      High Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium" className="pt-2 pb-2 pr-32">
                    <span className="flex items-center">
                      <Flag className="w-4 h-4 mr-2 text-yellow-500" />
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="low" className="pt-2 pb-2 pr-32">
                    <span className="flex items-center">
                      <Flag className="w-4 h-4 mr-2 text-green-500" />
                      Low Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="note"
                placeholder="Add notes about this conversation..."
                value={note}
                onChange={handleNoteChange}
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}