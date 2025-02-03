"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/class-merger'
import { Button } from '../../lib/ui/button'
import {
   Users,
   BarChart3,
   Settings,
   MessagesSquare,
   LayoutDashboard,
} from 'lucide-react'
import Image from 'next/image'

const sidebarItems = [
   { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
   { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
   { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
   { name: 'Messages', href: '/dashboard/messages', icon: MessagesSquare },
   { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
   const pathname = usePathname()
   const [collapsed, setCollapsed] = useState(false)

   return (
      <div className={cn(
         "border bg-white",
         collapsed ? "w-16" : "w-64",
         "transition-all duration-300"
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
               {sidebarItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
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
                        >
                           <Icon className={cn(
                              "h-5 w-5",
                              collapsed ? "mr-0" : "mr-2",
                           )} />
                           {!collapsed && <span>{item.name}</span>}
                        </Button>
                     </Link>
                  )
               })}
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