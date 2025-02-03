import { getGlobalSession } from "@/utils/global-session";

export default function Dashboard() {
   // fetching session
   const session = getGlobalSession();

   return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-white">
         <h2 className="text-black">Berhasil masuk</h2>
      </div>
   );
}