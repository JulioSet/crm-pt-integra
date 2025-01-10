import Sidebar from "./sidebar";

export default function DashboardLayout({ 
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   return(
      <div className="flex h-screen">
         <Sidebar />
         <main className="flex-1 overflow-auto">
            {children}
         </main>
      </div>
   );
}