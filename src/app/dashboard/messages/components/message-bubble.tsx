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
        message.responder === "integra" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          message.responder === "integra"
            ? "bg-blue-600 text-white"
            : "bg-white"
        )}
      >
        <p className="text-sm">{message.pesan}</p>
        <span className="pt-1 block text-right text-xs opacity-70">
          {formatMessageTime(message.waktu)}
        </span>
      </div>
    </div>
  )
}