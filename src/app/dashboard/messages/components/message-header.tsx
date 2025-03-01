import { Check } from "lucide-react"
import { Button } from "../../../../lib/ui/button"
import { Conversation } from "@/lib/definitions"

interface MessageHeaderProps {
  role: string,
  conversation: Conversation | null,
  onResolve: () => void
}
 
export function MessageHeader({ role, conversation, onResolve }: MessageHeaderProps) {
  const identity = conversation?.nama ?? `+${conversation?.telepon}`

  return (
    <div className="border-b p-4 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="font-semibold text-foreground">{identity}</h2>
        </div>
      </div>
        {role === 'cs' &&
          <Button variant="ghost" size="icon" className="flex p-1" onClick={onResolve}>
            <Check className="h-4 w-4" />
            <span className="p-1">Resolve</span>
          </Button>
        }
    </div>
  )
}