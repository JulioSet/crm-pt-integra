"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/class-merger'
import { Button } from '../../ui/button'
import {
   Users,
   Settings,
   MessagesSquare,
   Bell,
   UserCog,
   FileBarChart,
   LogOut,
   Activity,
   ReceiptText,
} from 'lucide-react'
import Image from 'next/image'
import { getSession } from '@/lib/employee'
import useChatStore from '@/store/chatStore'

const sidebarItems = [
   { name: 'Pesan', href: '/dashboard/messages', icon: MessagesSquare, access: ['admin', 'sales', 'cs', 'tech', 'resepsionis'] },
   { name: 'Notifikasi', href: '/dashboard/notifications', icon: Bell, access: ['admin', 'sales', 'cs', 'tech', 'resepsionis'] },
   { name: 'Agent', href: '/dashboard/agents', icon: UserCog, access: ['admin'] },
   { name: 'Izin Delegasi', href: '/dashboard/delegation_permission', icon: Activity, access: ['admin'] },
   { name: 'Riwayat Delegasi', href: '/dashboard/delegation_history', icon: ReceiptText, access: ['admin', 'sales', 'cs'] },
   { name: 'Kontak', href: '/dashboard/contacts', icon: Users, access: ['admin', 'sales'] },
   { name: 'Laporan', href: '/dashboard/reports', icon: FileBarChart, access: ['admin'] },
   { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings, access: ['admin'] },
   { name: 'Keluar', href: '/', icon: LogOut, access: ['admin', 'sales', 'cs', 'tech', 'resepsionis'] },
]

export default function Sidebar() {
   // agent data
   const [role, setRole] = useState("")
   // sidebar 
   const { resetLoadingStateToLogout } = useChatStore();
   const pathname = usePathname()
   const [collapsed, setCollapsed] = useState(false)
   // notification
   const { data } = useChatStore();
   const [unreadCount, setUnreadCount] = useState(0)

   // set agent data
   useEffect(() => {
      (async () => {
         const session = await getSession()
         setRole(session?.role)
      })()
   })

   // set unread count
   useEffect(() => {
      let totalUnread = 0
      data.forEach(conversation => {
         if (conversation.baca === false) {
            totalUnread++
         }
      })
      setUnreadCount(totalUnread)
   }, [data])

   return (
      <div className={cn(
         "border bg-white",
         collapsed ? "w-16" : "w-64",
         "transition-all duration-300",
         "overflow-y-auto"
      )}>
         <div className="flex h-full flex-col">
            <div className="flex justify-center items-center p-4 border-b">
               <Image
                  src="/auth/logo.png"
                  width={160}
                  height={180}
                  alt="PT Integra Logo"
               />
            </div>
            <nav className="flex-1 space-y-1 p-2">
               {sidebarItems
                  .filter(item => item.access.includes(role))
                  .map((item) => {
                     const Icon = item.icon
                     const isActive = pathname === item.href
                     const isNotifications = item.href === '/dashboard/notifications'
                     return (
                        <Link key={item.href} href={item.href}>
                           <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className={cn(
                                 "w-full flex justify-start",
                                 collapsed ? "px-2" : "px-4",
                                 collapsed && "flex justify-center items-center",
                                 isActive && "text-blue-600"
                              )}
                              onClick={() => {
                                 if (item.name === 'Keluar') {
                                    resetLoadingStateToLogout();
                                 }
                              }}
                           >
                              <Icon className={cn(
                                 "h-5 w-5",
                                 collapsed ? "mr-0" : "mr-2",
                              )} />
                              {!collapsed && <span>{item.name}</span>}
                              {isNotifications && unreadCount > 0 && (
                                 <div className='pl-1'>
                                    <div className='inline-flex items-center rounded-full border border-transparent px-1.5 text-xs font-semibold bg-red-500 text-white'>
                                       {unreadCount}
                                    </div>
                                 </div>
                              )}
                           </Button>
                        </Link>
                     )
                  })
               }
            </nav>
            <div className="p-4 border-t">
               <Button
                  variant="ghost"
                  className="w-full flex justify-center"
                  onClick={() => setCollapsed(!collapsed)}
               >
                  {collapsed ? "→" : "←"}
               </Button>
            </div>
         </div>
      </div>
   )
}