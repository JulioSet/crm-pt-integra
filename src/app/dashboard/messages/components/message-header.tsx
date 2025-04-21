import { Check, X } from "lucide-react"
import { Button } from "../../../../ui/button"
import { Conversation } from "@/lib/definitions"

interface MessageHeaderProps {
  role: string,
  conversation: Conversation | null,
  onResolve: () => void,
  onClose: () => void
}
 
export function MessageHeader({ role, conversation, onResolve, onClose }: MessageHeaderProps) {
  const identity = conversation?.nama ?? `+${conversation?.telepon}`

  return (
    <div className="border-b p-4 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="font-semibold text-foreground">{identity}</h2>
        </div>
      </div>
      <Button variant="ghost" className='ml-auto' onClick={onClose}>
        <X className="h-4 w-4" />
        <span className="pl-1">Tutup Chat</span>
      </Button>
      {(role !== 'resepsionis') &&
        <Button variant="ghost" onClick={onResolve}>
          <Check className="h-4 w-4" />
          <span className="pl-1">Resolve</span>
        </Button>
      }
    </div>
  )
}