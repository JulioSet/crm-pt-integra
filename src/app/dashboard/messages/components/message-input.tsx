import { useState } from "react"
import { Input } from "@/ui/input"
import { Button } from "../../../../ui/button"
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
        <Button type="submit" size="icon" variant="default" className="hover:bg-blue-800">
          <Send className="h-4 w-8 text-white" />
        </Button>
      </div>
    </form>
  )
}