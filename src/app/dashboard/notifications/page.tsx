"use client"

import { Card, CardContent } from "@/ui/card"
import { Button } from "@/ui/button"
import { Bell, Check, MessageSquare } from "lucide-react"
import { formatDateDistance } from "@/utils/date"
import { redirect } from "next/navigation"
import useChatStore from "@/store/chatStore"
import { useEffect, useState } from "react"
import { updateRead } from "@/lib/message"

export default function Notifications() {
   const { data } = useChatStore();
   const [unreadCount, setUnreadCount] = useState(0)

   // set unread notification
   useEffect(() => {
      let totalUnread = 0
      data.forEach(conversation => {
         if (conversation.baca === false) {
            totalUnread++
         }
      })
      setUnreadCount(totalUnread)
   }, [data])

   const replyMessage = (phone: string) => {
      localStorage.setItem("telepon", phone)
      redirect('/dashboard/messages')
   }

   const markAsRead = async (phone: string) => {
      await updateRead(phone)
   }
   
   return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <h2 className="text-3xl font-bold tracking-tight">Notifikasi</h2>
               {unreadCount > 0 && (
                  <div className='inline-flex items-center rounded-full border border-transparent px-1.5 text-xs font-semibold bg-red-500 text-white'>
                     {unreadCount}
                  </div>
               )}
            </div>
         </div>

         <div className="space-y-4">
            {unreadCount === 0 ? (
               <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                     <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                     <h3 className="font-semibold text-lg">Tidak ada notifikasi baru</h3>
                     <p className="text-muted-foreground">
                        Sudah selesai! Nanti kembali lagi untuk memeriksa pesan baru.
                     </p>
                  </CardContent>
               </Card>
            ) : (
               data
                  .filter(conversation => conversation.baca === false)
                  .map((conversation) => (
                     <Card
                        key={conversation.telepon}
                        className={`transition-colors ${
                           conversation.baca ? "bg-background" : "bg-secondary/20"
                        }`}
                     >
                        <CardContent className="flex items-start space-x-4 p-4">
                           <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                 <p className="font-medium">{conversation.nama ?? `+${conversation.telepon}`}</p>
                                 <span className="text-sm text-muted-foreground">
                                    {formatDateDistance(conversation.waktu_terbaru)}
                                 </span>
                              </div>
                              <p className="text-sm text-muted-foreground">{conversation.pesan_terbaru}</p>
                              <div className="flex items-center space-x-2 pt-2">
                                 <Button
                                    variant="ghost"
                                    size="default"
                                    onClick={() => replyMessage(conversation.telepon)}
                                 >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Balas
                                 </Button>
                                 {!conversation.baca && (
                                    <Button
                                       variant="ghost"
                                       size="default"
                                       onClick={() => markAsRead(conversation.telepon)}
                                    >
                                       <Check className="mr-2 h-4 w-4" />
                                       Tandai sudah dibaca
                                    </Button>
                                 )}
                              </div>
                           </div>
                        </CardContent>
                     </Card>
               ))
            )}
         </div>
      </div>
   )
}