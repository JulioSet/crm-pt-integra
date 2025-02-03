import { cn } from "@/utils/class-merger"
import { ScrollArea } from "@/lib/ui/scroll-area"
import { CheckCircle2, Clock, DollarSign, Flame, LucideIcon, MessageCircle, MessageCircleWarning, Plus, Search, Snowflake } from "lucide-react"
import { Button } from "../../../../lib/ui/button"
import { Input } from "@/lib/ui/input"
import { Conversation, MessageStatus } from "@/lib/definitions"
import { formatDateDistance } from "@/utils/date"
import { useState } from "react"

interface MessagesSidebarProps {
   conversations: Conversation[]
   selectedConversation: Conversation | null
   onSelectConversation: (conversation: Conversation) => void
}
 
const filters: { label: string; value: MessageStatus; icon: LucideIcon }[] = [
   { label: "New Case", value: "new", icon: MessageCircleWarning },
   { label: "Ongoing", value: "ongoing", icon: Clock },
   { label: "Hot", value: "hot", icon: Flame },
   { label: "Cold", value: "cold", icon: Snowflake },
   { label: "Deal", value: "deal", icon: DollarSign },
   { label: "Resolved", value: "resolved", icon: CheckCircle2 },
 ]

export function MessagesSidebar({ 
   conversations, 
   selectedConversation,
   onSelectConversation 
}: MessagesSidebarProps) {
   const [selectedFilter, setSelectedFilter] = useState<MessageStatus | null>(null)
   const [searchQuery, setSearchQuery] = useState("")

   const filteredConversations = conversations.filter(conversation => {
      const matchesFilter = selectedFilter ? conversation.status === selectedFilter : true
      const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
   })

   return (
      <div className="w-[300px] border-r flex flex-col bg-white">
         <div className="p-4 border-b space-y-4">
            <div className="flex justify-between">
               <h2 className="text-xl font-semibold text-foreground">Messages</h2>
               <Button size="icon" variant="ghost">
                  <Plus className="h-4 w-4 m-1" />
               </Button>
            </div>
            <div className="relative">
               <Search className="absolute left-2 top-2.5 h-4 w-4" />
               <Input 
                  placeholder="Search messages..." 
                  className="rounded-md pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
               />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
               {filters.map(filter => {
                  const Icon = filter.icon
                  const isSelected = selectedFilter === filter.value
                  return (
                  <Button
                     key={filter.value}
                     variant={isSelected ? "default" : "outline"}
                     size="sm"
                     className={"rounded-md flex h-8 px-3 whitespace-nowrap"}
                     onClick={() => setSelectedFilter(isSelected ? null : filter.value)}
                  >
                     <Icon className="h-4 w-4 mr-1.5" />
                     <span className="text-xs font-medium">{filter.label}</span>
                  </Button>
                  )
               })}
            </div>
         </div>
         <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
               {filteredConversations.map((conversation) => {
                  const StatusIcon = filters.find(f => f.value === conversation.status)?.icon || MessageCircle
                  return (
                  <button
                     key={conversation.id}
                     onClick={() => onSelectConversation(conversation)}
                     className={cn(
                        "w-full p-3 rounded-lg text-left flex items-center space-x-3 hover:bg-slate-100",
                        selectedConversation?.id === conversation.id && "bg-slate-100"
                     )}
                  >
                     <StatusIcon className={cn(
                        "h-5 w-5",
                        conversation.status === "new" && "text-purple-500",
                        conversation.status === "ongoing" && "text-yellow-500",
                        conversation.status === "hot" && "text-red-500",
                        conversation.status === "cold" && "text-blue-500",
                        conversation.status === "deal" && "text-green-500",
                        conversation.status === "resolved" && "text-emerald-500"
                     )} />
                     <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                           <span className="font-medium text-foreground">{conversation.name}</span>
                           <span className="text-xs text-muted-foreground">
                              {formatDateDistance(conversation.lastMessageAt)}
                           </span>
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                           {conversation.lastMessage}
                        </div>
                     </div>
                  </button>
                  )
               })}
            </div>
         </ScrollArea>
      </div>
   )
}