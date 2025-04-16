'use client'

import { Toaster } from "@/ui/sonner";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { getResponseTimeSetting } from "@/lib/setting";
import useChatStore from "@/store/chatStore";

export default function DashboardLayout({ 
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   const { fetchData } = useChatStore();

   // start fetch conversations
   useEffect(() => {
      (async () => {
         const setting = await getResponseTimeSetting()
         const interval = parseInt(setting)
         fetchData(interval)
      })()
   }, [fetchData]);

   return(
      <div className="flex h-screen bg-white">
         <Sidebar />
         <main className="flex-1 overflow-auto">
            {children}
         </main>
         <Toaster />
      </div>
   );
}