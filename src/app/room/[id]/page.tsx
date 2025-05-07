"use client"

import { Fragment, use, useEffect, useRef, useState } from "react";
import { RoomChatHeader } from "./components/room-chat-header";
import { RoomChat } from "@/lib/definitions";
import { RoomChatBubble } from "./components/room-chat-bubble";
import { MessageInput } from "@/app/dashboard/messages/components/message-input";
import { deleteRoomChat, fetchRoomChat, sendMessageRoomChat } from "@/lib/email_complain";
import { getSession } from "@/lib/employee";
import Image from "next/image";
import { redirect } from "next/navigation";

interface RoomParams {
   id: string;
}

interface RoomPageProps {
   params: Promise<RoomParams>
}

export default function RoomPage({ params }: RoomPageProps) {
   const [loading, setLoading] = useState(true)
   // data
   const [exist, setExist] = useState(true)
   const { id } = use(params)
   const [access, setAccess] = useState('')
   const [roomChat, setRoomChat] = useState<RoomChat>()
   // auto-scroll bottom
   const messageViewRef = useRef<HTMLDivElement | null>(null);
   const [lastMessage, setLastMessage] = useState("")
   const [opened, setOpened] = useState(false)

   useEffect(() => {
      // fetch data 
      const fetch = async () => {
         const room = await fetchRoomChat(id)
         if (room.data) {
            setRoomChat(room.data)
         } else {
            setExist(false)
         }
      }
      fetch()

      const interval = setInterval(() => {
         fetch(); // Re-fetch every second
      }, 1000);
   
      return () => clearInterval(interval)
   }, [id])

   useEffect (() => {
      // setting up access
      const setupAccess = async () => {
         const session = await getSession()
         if (session.status === 404) {
            setAccess('client')
         } else {
            setAccess('integra')
         }
      }
      setupAccess()
      setLoading(false)
   }, [])

    // to auto scroll
   useEffect(() => {
      if (exist) {
         const container = messageViewRef.current;
         if (!container) return;
         
         // to ensure it only work during first time opening
         if (!opened) {
         container.scrollTo({ top: container.scrollHeight });
         }
         
         // if there is a new chat
         if (roomChat?.room_chat_content) {
            const newMessage = lastMessage !== roomChat?.room_chat_content.at(-1)?.pesan
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
            if (newMessage && isAtBottom) {
               container.scrollTo({ top: container.scrollHeight });
               setLastMessage(roomChat?.room_chat_content.at(-1)?.pesan ?? "")
            }
         }
   
         setOpened(true)
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [roomChat]); // Re-run when there are changes

   const handleResolve = async () => {
      // Handle resolving chat
      await deleteRoomChat(id)
      redirect('/dashboard/email_complain')
   }

   const handleSendMessage = async (message: string) => {
      // Handle sending message
      await sendMessageRoomChat(id, message, access)
   }

   return (
      <>
         {loading && (
            <div className="flex h-screen items-center justify-center">
               <div className="bg-white rounded-lg p-5">
                  <Image
                     src="/auth/logo.png"
                     width={240}
                     height={280}
                     alt="PT Integra Logo"
                  />
               </div>
            </div>
         )}
         {exist ? (
            <div className="flex flex-col min-h-screen bg-background">
               <div className="flex-1 flex flex-col">
                  <RoomChatHeader roomChat={roomChat ?? null} access={access} onResolve={handleResolve} />
                  {/* message body */}
                  <div ref={messageViewRef} className="flex-1 p-4 bg-zinc-300 overflow-y-auto">
                     <div className="space-y-4">
                        {roomChat?.room_chat_content?.map((message) => {
                           return (
                              <Fragment key={message.id}>
                                 <RoomChatBubble key={message.id} access={access} message={message} />
                              </Fragment>
                           )
                        })}
                     </div>
                  </div>
                  <MessageInput onSendMessage={handleSendMessage} />
               </div>
            </div>
         ) : (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
               <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Not Found</h1>
            </div>
         )}
      </>
   )
}
