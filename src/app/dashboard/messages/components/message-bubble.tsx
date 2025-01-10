import { Message } from "@/lib/definitions"
import { cn } from "@/utils/class-merger"
import { formatMessageTime } from "@/utils/date"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex",
        message.sender === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          message.sender === "user"
            ? "bg-blue-600 text-white"
            : "bg-slate-100"
        )}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70">
          {formatMessageTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}