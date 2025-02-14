import Image from "next/image";

export default function Loading() {
   return (
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
   );
 }