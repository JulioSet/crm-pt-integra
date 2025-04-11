import Link from 'next/link'
import { cn } from "@/utils/class-merger"
import { CheckCircle2, Clock, DollarSign, Flame, LucideIcon, MessageCircle, MessageCircleWarning, Plus, Search, Snowflake } from "lucide-react"
import { Button } from "../../../../ui/button"
import { Input } from "@/ui/input"
import { Conversation, MessageLabel } from "@/lib/definitions"
import { formatDateDistance } from "@/utils/date"
import { useEffect, useState } from "react"
import { Skeleton } from "@/ui/skeleton"
import { getSession } from "@/lib/employee"

interface MessagesSidebarProps {
   conversations: Conversation[]
   selectedConversation: Conversation | null
   onSelectConversation: (phone: string) => void
   loading: boolean
}

const filters: { label: string; value: MessageLabel; icon: LucideIcon; access: string }[] = [
   { label: "New Case", value: "new", icon: MessageCircleWarning, access: '' },
   { label: "Ongoing", value: "ongoing", icon: Clock, access: '' },
   { label: "Hot", value: "hot", icon: Flame, access: 'sales' },
   { label: "Cold", value: "cold", icon: Snowflake, access: 'sales' },
   { label: "Deal", value: "deal", icon: DollarSign, access: 'sales' },
   { label: "Resolved", value: "resolved", icon: CheckCircle2, access: 'cs' },
]

function ConversationSkeleton() {
   return (
      <div className="p-3 rounded-lg">
         <div className="flex items-center space-x-3">
         <Skeleton className="animate-pulse h-5 w-5 rounded-full bg-zinc-300" />
         <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
               <Skeleton className="animate-pulse h-4 w-24 bg-zinc-300" />
               <Skeleton className="animate-pulse h-3 w-12 bg-zinc-300" />
            </div>
            <Skeleton className="animate-pulse h-3 w-full bg-zinc-300" />
         </div>
         </div>
      </div>
   )
}

export function MessagesSidebar({ 
   conversations, 
   selectedConversation,
   onSelectConversation,
   loading
}: MessagesSidebarProps) {
   // agent data
   const [role, setRole] = useState("")
   // filter feature
   const [selectedFilter, setSelectedFilter] = useState<MessageLabel | null>(null)
   const [searchQuery, setSearchQuery] = useState("")

   const filteredConversations = conversations.filter(conversation => {
      const matchesFilter = selectedFilter ? conversation.label === selectedFilter : true
      const matchesSearchNama = conversation.nama?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSearchTelepon = conversation.telepon.includes(searchQuery)
      return matchesFilter && (matchesSearchNama || matchesSearchTelepon)
   })

   // set agent data
   useEffect(() => {
      (async () => {
         const session = await getSession()
         setRole(session?.role)
      })()
   }, [role])

   return (
      <div className="w-[300px] border-r flex flex-col bg-white">
         <div className="p-4 border-b space-y-4">
            <div className="flex justify-between">
               <h2 className="text-xl font-semibold text-foreground">Pesan</h2>
               <Link href={'/dashboard/contacts'}>
                  <Button size="icon" variant="ghost">
                     <Plus className="h-4 w-4 m-1" />
                  </Button>
               </Link>
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
                  if (filter.access === role || filter.access === '') {
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
                  }
               })}
            </div>
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-2">
               {loading && (
                  <>
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                     <ConversationSkeleton />
                  </>
               )}
               {filteredConversations.map((conversation) => {
                  const identity = conversation.nama ?? `+${conversation.telepon}`
                  const StatusIcon = filters.find(f => f.value === conversation.label)?.icon || MessageCircle
                  return (
                     <button
                        key={conversation.telepon}
                        onClick={() => onSelectConversation(conversation.telepon)}
                        className={cn(
                           "w-full p-3 rounded-lg text-left flex items-center space-x-3 hover:bg-slate-100",
                           selectedConversation?.telepon === conversation.telepon && "bg-slate-100"
                        )}
                     >
                        <StatusIcon className={cn(
                           "h-5 w-5",
                           conversation.label === "new" && "text-purple-500",
                           conversation.label === "ongoing" && "text-yellow-500",
                           conversation.label === "hot" && "text-red-500",
                           conversation.label === "cold" && "text-blue-500",
                           conversation.label === "deal" && "text-green-500",
                           conversation.label === "resolved" && "text-emerald-500"
                        )} />
                        <div className="flex-1 overflow-hidden">
                           <div className="flex justify-between items-center">
                              <span className="font-medium text-foreground">{identity}</span>
                              <span className="text-xs text-muted-foreground">
                                 {formatDateDistance(conversation.waktu_terbaru)}
                              </span>
                           </div>
                           <div className="text-sm text-muted-foreground line-clamp-1">
                              {conversation.pesan_terbaru}
                           </div>
                        </div>
                     </button>
                  )
               })}
            </div>
         </div>
      </div>
   )
}