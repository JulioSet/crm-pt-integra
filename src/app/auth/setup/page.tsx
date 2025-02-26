"use client";

import { FormEvent, useState } from "react";
import Image from 'next/image'
import { createEmployee } from "@/lib/employee";
import { redirect } from "next/navigation";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet('1234567890', 10) // id

export default function Setup() {
   // authentication
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");

   const handleSetup = async (e: FormEvent) => {
      e.preventDefault();
      createEmployee(nanoid(), username, password, 'admin');
      redirect("/dashboard");
   };

   return (
      <div 
         className="grid items-center justify-items-center min-h-screen bg-gray-300" 
      >
         <Image
            src="/auth/logo.png"
            width={150}
            height={250}
            alt="PT Integra Logo"
         />
         <div 
            className="rounded bg-white shadow-md text-black p-5"
         >
            <p className="text-lg font-bold pb-5">Buatlah akun administrator dengan mengisi form di bawah ini</p>
            <form onSubmit={handleSetup}>
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Nama Pengguna
                  </label>
                  <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
               </div>
               <div className="mb-2">
                  <label className="block text-sm font-medium mb-2">
                     Kata Sandi
                  </label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  />
               </div>
               <p className="text-xs font-thin mb-4 text-red-500">Penting : Mohon disimpan di tempat yang aman karena kredensial ini digunakan untuk masuk sebagai administrator</p>
               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
               >
                  Buat
               </button>
            </form>
         </div>
      </div>
   );
}
