"use client"

import { Card, CardContent } from "@/ui/card"
import { Button } from "@/ui/button"
import { Bell, Check, MessageSquare, X } from "lucide-react"
import { formatDateDistance } from "@/utils/date"
import { redirect } from "next/navigation"
import useChatStore from "@/store/chatStore"
import { useEffect, useState } from "react"
import { updateRead } from "@/lib/message"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { deleteDelegationNotification, fetchDelegationNotification } from "@/lib/delegation"
import { DelegationNotification } from "@/lib/definitions"
import { getSession } from "@/lib/employee"

export default function Notifications() {
   const { data } = useChatStore();
   const [agent, setAgent] = useState("")
   const [listDelegationNotification, setListDelegationNotification] = useState<DelegationNotification[]>([])
   const [notificationCount, setNotificationCount] = useState(0)
   const [category, setCategory] = useState("all")

   const replyMessage = (phone: string) => {
      localStorage.setItem("telepon", phone)
      redirect('/dashboard/messages')
   }

   const markAsRead = async (phone: string) => {
      await updateRead(phone)
   }

   const handleDelegationNotification = async (id: number) => {
      await deleteDelegationNotification(id)
   }

   useEffect(() => {
      (async () => {
         const session = await getSession()
         setAgent(session?.id)
      })()
   })

   // set unread notification
   useEffect(() => {
      let totalUnread = 0
      data.forEach(conversation => {
         if (conversation.baca === false) {
            totalUnread++
         }
      })

      let delegationNotification: number
      (async () => {
         const fetchDelegation: DelegationNotification[] = await fetchDelegationNotification()
         if (data) {
            setListDelegationNotification(fetchDelegation)
         }
         delegationNotification = fetchDelegation.filter(del => del.agen_sekarang === agent || del.agen_sebelum === agent).length

         if (category === "all") {
            setNotificationCount(totalUnread + delegationNotification)
         }
         if (category === "message") {
            setNotificationCount(totalUnread)
         }
         if (category === "delegation") {
            setNotificationCount(delegationNotification)
         }
      })()

   }, [data, category, agent])
   
   return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <h2 className="text-3xl font-bold tracking-tight">Notifikasi</h2>
               {notificationCount > 0 && (
                  <div className='inline-flex items-center rounded-full border border-transparent px-1.5 text-xs font-semibold bg-red-500 text-white'>
                     {notificationCount}
                  </div>
               )}
            </div>
         </div>
         
         <div className="w-44">
            <Select value={category} onValueChange={setCategory}>
               <SelectTrigger className="w-full rounded">
                  <SelectValue placeholder="Pasang Kategori" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="all" className="pt-2 pb-2 mr-1 pr-7">
                     <span className="flex items-center">
                        Semua
                     </span>
                  </SelectItem>
                  <SelectItem value="message" className="pt-2 pb-2 mr-1 pr-7">
                     <span className="flex items-center">
                        Pesan
                     </span>
                  </SelectItem>
                  <SelectItem value="delegation" className="pt-2 pb-2 mr-1 pr-7">
                     <span className="flex items-center">
                        Delegasi
                     </span>
                  </SelectItem>
               </SelectContent>
            </Select>
         </div>

         <div className="space-y-4">
            {notificationCount === 0 ? (
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
               <>
                  {(() => {
                     // all category
                     if (category === "all") {
                        return (
                           <>
                              {/* message */}
                              {data
                                 .filter(conversation => conversation.baca === false)
                                 .map((conversation) => (
                                    <Card
                                       key={conversation.telepon}
                                       className="transition-colors bg-secondary/20"
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
                              }

                              {/* delegation */}
                              {listDelegationNotification
                                 .filter(data => data.agen_sekarang === agent || data.agen_sebelum === agent)
                                 .map((data) => (
                                    <Card
                                       key={data.id}
                                       className="transition-colors bg-secondary/20"
                                    >
                                       <CardContent className="flex items-start space-x-4 p-4">
                                          <div className="flex-1 space-y-1">
                                             <div className="flex items-center justify-between">
                                                <p className="font-medium">Pesan dengan {data.nama ? `nama ${data.nama}` : `nomor +${data.telepon}`} telah didelegasikan {data.agen_sekarang === agent ? 'kepada' : 'dari'} anda</p>
                                             </div>
                                             <p className="text-sm text-muted-foreground">{data.alasan}</p>
                                             <div className="flex items-center space-x-2 pt-2">
                                                   <Button
                                                      variant="ghost"
                                                      size="default"
                                                      onClick={() => handleDelegationNotification(data.id)}
                                                   >
                                                      <X className="mr-2 h-4 w-4" />
                                                      Tutup
                                                   </Button>
                                                </div>
                                          </div>
                                       </CardContent>
                                    </Card>
                                 ))
                              }
                           </>
                        )
                     } else if (category === "message") {
                        return (
                           <>
                              {
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
                              }
                           </>
                        )
                     } else if (category === "delegation") {
                        return (
                           <>
                              {
                                 listDelegationNotification.map((data) => (
                                    <Card
                                       key={data.id}
                                       className="transition-colors bg-secondary/20"
                                    >
                                       <CardContent className="flex items-start space-x-4 p-4">
                                          <div className="flex-1 space-y-1">
                                             <div className="flex items-center justify-between">
                                                <p className="font-medium">Pesan dengan {data.nama ? `nama ${data.nama}` : `nomor +${data.telepon}`} telah didelegasikan {data.agen_sekarang === agent ? 'kepada' : 'dari'} anda</p>
                                             </div>
                                             <p className="text-sm text-muted-foreground">{data.alasan}</p>
                                             <div className="flex items-center space-x-2 pt-2">
                                                <Button
                                                   variant="ghost"
                                                   size="default"
                                                   onClick={() => handleDelegationNotification(data.id)}
                                                >
                                                   <X className="mr-2 h-4 w-4" />
                                                   Tutup
                                                </Button>
                                             </div>
                                          </div>
                                       </CardContent>
                                    </Card>
                                 ))
                              }
                           </>
                        )
                     } else {
                        return <p className="text-center text-muted-foreground">Kategori tidak dikenali.</p>;
                     }
                     // category code end here
                  })()}
               </>
               )
            }
         </div>
      </div>
   )
}