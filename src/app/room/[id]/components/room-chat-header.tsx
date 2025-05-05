import { Check } from "lucide-react"
import { Button } from "../../../../ui/button"
import { RoomChat } from "@/lib/definitions"
import { useEffect, useState } from "react"

interface MessageHeaderProps {
  roomChat: RoomChat | null,
  access: string,
  onResolve: () => void
}
 
export function RoomChatHeader({ roomChat, access, onResolve }: MessageHeaderProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (access === 'integra') {
      setName(roomChat?.nama || '')
    } else {
      setName('Integra Support')
    }
  }, [access, roomChat?.nama])

  return (
    <div className="border-b p-4 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="font-semibold text-foreground">{name}</h2>
        </div>
      </div>
      {access === 'integra' && (
        <Button variant="ghost" onClick={onResolve}>
          <Check className="h-4 w-4" />
          <span className="pl-1">Resolve</span>
        </Button>
      )}
    </div>
  )
}