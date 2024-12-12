import Image from "next/image";

export default function Loading() {
   return (
      <div className="grid items-center justify-items-center min-h-screen bg-gray-400" >
         <div className="m-5 grid items-center justify-items-center rounded bg-white shadow-md text-black p-5">
            <Image
               src="/auth/logo.png"
               width={150}
               height={250}
               alt="PT Integra Logo"
            />
         </div>
      </div>
   );
}