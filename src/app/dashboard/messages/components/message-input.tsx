import { useState } from "react"
import { Input } from "@/lib/ui/input"
import { Button } from "../../../../lib/ui/button"
import { Send } from "lucide-react"

interface MessageInputProps {
   onSendMessage: (message: string) => void
}
 
export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    onSendMessage(newMessage)
    setNewMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
      <div className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" className="bg-blue-600">
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  )
}