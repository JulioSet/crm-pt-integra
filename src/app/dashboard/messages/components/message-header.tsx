import { Check, CircleArrowOutUpRight } from "lucide-react"
import { Button } from "../../../../lib/ui/button"
import { Conversation } from "@/lib/definitions"

interface MessageHeaderProps {
  conversation: Conversation | null,
  onResolve: () => void,
  onAssign: () => void
}
 
export function MessageHeader({ conversation, onResolve, onAssign }: MessageHeaderProps) {
  const identity = conversation?.nama ?? `+${conversation?.telepon}`

  return (
    <div className="border-b p-4 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="font-semibold text-foreground">{identity}</h2>
        </div>
      </div>
      <div className="flex">
        <Button variant="ghost" size="icon" className="flex p-1 mr-1" onClick={onAssign}>
          <CircleArrowOutUpRight className="h-4 w-4" />
          <span className="p-1">Assign</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex p-1" onClick={onResolve}>
          <Check className="h-4 w-4" />
          <span className="p-1">Resolve</span>
        </Button>
      </div>
    </div>
  )
}