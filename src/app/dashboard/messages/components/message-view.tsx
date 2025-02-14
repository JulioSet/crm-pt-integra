import { Conversation, MessageLabel, MessagePriority } from "@/lib/definitions"
import { MessageHeader } from "./message-header"
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
  const phone = conversation.telepon
  const [label, setLabel] = useState(conversation.label)
  const [priority, setPriority] = useState(conversation.prioritas || "medium")
  const [note, setNote] = useState(conversation.catatan || "")
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [failedMessage, setFailedMessage] = useState(false);

  const handleAssign = () => {
    // Handle assign to other agent
    console.log("Assign")
  }

  const handleResolve = () => {
    // Handle resolving conversation
    console.log("Resolved")
  }

  const handleSendMessage = (message: string) => {
    // Handle sending message
    const check = sendMessage(phone, message)
    if (!check) {
      setFailedMessage(true)
    }
  }
  
  const handleLabelChange = (newLabel: MessageLabel) => {
    // Handle status change
    setLabel(newLabel)
    console.log("Status changed to:", newLabel)
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
        <MessageHeader conversation={conversation} onAssign={handleAssign} onResolve={handleResolve} />
        <div className="flex-1 p-4 bg-zinc-300 overflow-y-auto">
          <div className="space-y-4">
            {conversation.message_content?.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {failedMessage && 
              <div className="flex justify-center items-center">
                <div className="bg-white bg-opacity-10 rounded-full">
                  <p className="font-semibold text-sm px-1 py-1 pl-5 pr-5">Gagal Mengirim Pesan</p>
                </div>
              </div>
            }
          </div>
        </div>
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
              <Label className="text-md font-bold">Label</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant={label === "hot" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLabelChange("hot")}
                  className={cn(
                    "flex justify-start",
                    label === "hot" && "bg-red-500 hover:bg-red-600"
                  )}
                >
                  <Flame className="w-4 h-4 m-2" />
                  Hot Lead
                </Button>
                <Button
                  variant={label === "cold" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLabelChange("cold")}
                  className={cn(
                    "flex justify-start",
                    label === "cold" && "bg-blue-500 hover:bg-blue-600"
                  )}
                >
                  <Snowflake className="w-4 h-4 m-2" />
                  Cold Lead
                </Button>
                <Button
                  variant={label === "deal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLabelChange("deal")}
                  className={cn(
                    "flex justify-start",
                    label === "deal" && "bg-green-500 hover:bg-green-600"
                  )}
                >
                  <DollarSign className="w-4 h-4 m-2" />
                  Potential Deal
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-md font-bold">
                Priority Level
              </Label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="pt-2 pb-2 mr-1 pr-32">
                    <span className="flex items-center">
                      <Flag className="w-4 h-4 mr-2 text-red-500" />
                      High Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium" className="pt-2 pb-2 mr-1 pr-32">
                    <span className="flex items-center">
                      <Flag className="w-4 h-4 mr-2 text-yellow-500" />
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="low" className="pt-2 pb-2 mr-1 pr-32">
                    <span className="flex items-center">
                      <Flag className="w-4 h-4 mr-2 text-green-500" />
                      Low Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-md font-bold">
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