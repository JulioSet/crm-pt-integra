"use client"

import { createComplain } from "@/lib/email_complain";
import { Textarea } from "@/ui/textarea";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ContactUsPage() {
   const [error, setError] = useState("")
   // Field
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [complain, setComplain] = useState('')

   const handleCreateComplain = async (e: FormEvent) => {
      if (email === '' || name === '' || complain === '') {
         e.preventDefault();
         setError('Semua field harus diisi')
      } else {
         await createComplain(email, name, complain)
         toast('Berhasil mengirim keluhan')
      }
   };

   return (
      <div className="grid items-center justify-items-center min-h-screen bg-gray-300" >
         <div 
            className="m-5 rounded bg-white shadow-md text-black p-5 w-full max-w-md"
         >
            <div className="justify-items-center">
               <Image
                  src="/auth/logo.png"
                  width={150}
                  height={250}
                  alt="PT Integra Logo"
               />
            </div>
            <form onSubmit={handleCreateComplain}>
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Email
                  </label>
                  <input
                     type="text"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                     required
                  />
               </div>
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Nama
                  </label>
                  <input
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                     required
                  />
               </div>
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Keluhan
                  </label>
                  <Textarea
                     value={complain}
                     onChange={(e) => setComplain(e.target.value)}
                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                     required
                  />
               </div>
               {/* Show error */}
               {error && <p className="mb-4 text-red-500">{error}</p>}
               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
               >
                  Kirim
               </button>
            </form>
         </div>
      </div>
   )
}