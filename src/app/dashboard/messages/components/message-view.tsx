import { Conversation, Employee } from "@/lib/definitions"
import { MessageHeader } from "./message-header"
import { MessageInput } from "./message-input"
import { MessageBubble } from "./message-bubble"
import { Button } from "@/lib/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/lib/ui/card"
import { cn } from "@/utils/class-merger"
import { Fragment, useEffect, useRef, useState } from "react"
import { sendMessage } from "@/lib/message"
import { formatMessageDate } from "@/utils/date"
import { getEmployeeByRole, getSession } from "@/lib/employee"
import { MessagePanelAdmin } from "./admin/message-panel-admin"
import { MessagePanelSales } from "./sales/message-panel-sales"
import { MessagePanelCS } from "./cs/message-panel-cs"
import { MessagePanelTech } from "./tech/message-panel-tech"

interface MessageViewProps {
  conversation: Conversation | null
}

export function MessageView({ conversation }: MessageViewProps) {
  // agent data
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [listAgent, setListAgent] = useState<Employee[]>([])
  // conversation data
  const phone = conversation?.telepon || ""
  // auto-scroll bottom
  const messageViewRef = useRef<HTMLDivElement | null>(null);
  const [lastMessage, setLastMessage] = useState("")
  const [opened, setOpened] = useState(false)
  // failed message trigger
  const [failedMessage, setFailedMessage] = useState(false);
  // right panel toggle
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  // set agent data
  useEffect(() => {
    (async () => {
      const session = await getSession()
      setName(session?.name)
      setRole(session?.role)

      const data = await getEmployeeByRole(role)
      setListAgent(data)
    })()
  }, [role])

  // to auto scroll
  useEffect(() => {
    const container = messageViewRef.current;
    if (!container) return;
    
    // first time opening
    if (!opened) {
      container.scrollTo({ top: container.scrollHeight });
    }
    
    // if there is a new chat
    const newMessage = lastMessage !== conversation?.message_content.at(-1)?.pesan
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
    if ((newMessage || failedMessage) && isAtBottom) {
      container.scrollTo({ top: container.scrollHeight });
      setLastMessage(conversation?.message_content.at(-1)?.pesan ?? "")
    }

    setOpened(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, failedMessage]); // Re-run when there are changes

  const handleResolve = () => {
    // Handle resolving conversation
    console.log("Resolved")
  }

  const handleSendMessage = async (message: string) => {
    // Handle sending message
    if (phone !== undefined) {
      const check = await sendMessage(phone, message)
      if (!check) {
        setFailedMessage(true)
      } else {
        setFailedMessage(false)
      }
    }
  }

  const handleAssign = () => {
    // Handle assign to other agent with same role
    
  }

  return (
    <div className="flex-1 flex">
      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <MessageHeader role={role} conversation={conversation} onResolve={handleResolve} />
        {/* message body */}
        <div ref={messageViewRef} className="flex-1 p-4 bg-zinc-300 overflow-y-auto">
          <div className="space-y-4">
            {conversation?.message_content?.map((message, index, messages) => {
              const currentDate = formatMessageDate(message.waktu);
              const previousMessage = messages[index - 1];
              const previousDate = previousMessage ? formatMessageDate(previousMessage.waktu) : null;
            
              const showDateHeader = currentDate !== previousDate;

              return (
                <Fragment key={message.id}>
                  {showDateHeader && (
                    <div className="mx-auto my-2 px-3 py-1 bg-white text-black text-sm rounded-lg w-fit">
                      {currentDate}
                    </div>
                  )}
                  <MessageBubble key={message.id} message={message} />
                </Fragment>
              )
            })}
            {failedMessage && 
              <div className="flex justify-center items-center">
                <div className="bg-white bg-opacity-40 rounded-full">
                  <p className="font-semibold text-sm px-1 py-1 pl-5 pr-5">Gagal Mengirim Pesan</p>
                </div>
              </div>
            }
          </div>
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      
      {/* Message Detail - Right Panel */}
      <div className="relative border-l bg-white">
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
            "border-none rounded-none flex flex-col transition-all duration-300",
            isPanelCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-80 opacity-100"
          )}
        >
          {role === 'admin' ? (
            <MessagePanelAdmin conversation={conversation} />
          ) : role === 'sales' ? (
            <MessagePanelSales conversation={conversation} listAgent={listAgent} />
          ) : role === 'cs' ? (
            <MessagePanelCS conversation={conversation} listAgent={listAgent} />
          ) : role === 'tech' ? (
            <MessagePanelTech conversation={conversation} listAgent={listAgent} />
          ) : (
            <p>Unknown Role</p>
          )}
        </Card>
      </div>
    </div>
  )
}