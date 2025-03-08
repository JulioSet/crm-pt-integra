"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from 'next/image'
import { redirect } from "next/navigation";
import { getEmployee } from "@/lib/employee";

export default function Login() {
   // authentication
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   useEffect(() => {
      const setup = async () => {
         const response = await fetch('/api/setup');
         const employee = await response.json();
         
         if (!employee.create) {
            redirect("/auth/setup");
         }
      };
      setup();
   }, []);

   const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      const result = await getEmployee(username, password);

      if (!result?.success) {
         setError(result?.message || "Unknown error occurred");
         return;
      } else {
         console.log("Login successful:", result?.data);
         redirect("/dashboard/messages");
      }
   };

   return (
      <div className="grid items-center justify-items-center min-h-screen bg-gray-300" >
         <div 
            className="m-5 grid items-center justify-items-center rounded bg-white shadow-md text-black p-5"
         >
            <Image
               src="/auth/logo.png"
               width={150}
               height={250}
               alt="PT Integra Logo"
            />
            <form onSubmit={handleLogin}>
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Nama Pengguna
                  </label>
                  <input
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                     required
                  />
               </div>
               <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                     Kata Sandi
                  </label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                     required
                  />
               </div>
               {/* Show error */}
               {error && <p className="mb-4 text-red-500">{error}</p>}
               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
               >
                  Masuk
               </button>
            </form>
         </div>
      </div>
   );
}
