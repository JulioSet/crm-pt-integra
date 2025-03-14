import { Conversation, Employee } from "@/lib/definitions"
import { MessageHeader } from "./message-header"
import { MessageInput } from "./message-input"
import { MessageBubble } from "./message-bubble"
import { Button } from "@/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/ui/card"
import { cn } from "@/utils/class-merger"
import { Fragment, useEffect, useRef, useState } from "react"
import { assignMessage, sendMessage, updateRead } from "@/lib/message"
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
  // list agent based on role except admin
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
    
    // to ensure it only work during first time opening
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

    if (isAtBottom) {
      (async () => {
        await updateRead(phone)
      })()
    }

    setOpened(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, failedMessage]); // Re-run when there are changes

  const handleResolve = async () => {
    // Handle resolving conversation
    const message = 'Kami ingin mendengar pendapat Anda tentang layanan pelanggan kami! Mohon luangkan sedikit waktu untuk mengisi survei singkat ini: https://forms.gle/BDKJdn7Bb9Qvr4x39'
    const timestamp = Math.floor(Date.now() / 1000).toString()
    await sendMessage(phone, message, name, timestamp, '')
  }

  const handleSendMessage = async (message: string) => {
    // Handle sending message
    if (phone !== undefined) {
      const now = Math.floor(Date.now() / 1000)
      const lastMessage = conversation?.message_content.at(-1)
      let check
      if (lastMessage?.responder === 'client') {
        const timestampLastMessage = lastMessage?.waktu ? parseInt(lastMessage.waktu) : 0
        const responseTime = now - timestampLastMessage
        check = await sendMessage(phone, message, name, now.toString(), responseTime.toString())
      } else {
        check = await sendMessage(phone, message, name, now.toString(), '')
      }
      if (!check) {
        setFailedMessage(true)
      } else {
        setFailedMessage(false)
      }
    }
  }

  const handleAssign = async (chosenAgent: string) => {
    // Handle assign to other agent with same role
    try {
      await assignMessage(phone, chosenAgent)
    } catch (error) {
      console.error(error)
    }
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
            <MessagePanelAdmin conversation={conversation} assignAgent={handleAssign} />
          ) : role === 'sales' ? (
            <MessagePanelSales conversation={conversation} listAgent={listAgent} assignAgent={handleAssign} />
          ) : role === 'cs' ? (
            <MessagePanelCS conversation={conversation} listAgent={listAgent} assignAgent={handleAssign} />
          ) : role === 'tech' ? (
            <MessagePanelTech conversation={conversation} listAgent={listAgent} assignAgent={handleAssign} />
          ) : (
            <p></p>
          )}
        </Card>
      </div>
    </div>
  )
}