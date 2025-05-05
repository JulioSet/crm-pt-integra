import { MessageRoomChat } from "@/lib/definitions"
import { cn } from "@/utils/class-merger"

interface RoomChatBubbleProps {
  message: MessageRoomChat,
  access: string
}

export function RoomChatBubble({ message, access }: RoomChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex",
        message.responder === access ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          message.responder === access
            ? "bg-blue-500 text-white"
            : "bg-white"
        )}
      >
        <p className="text-sm">{message.pesan}</p>
      </div>
    </div>
  )
}