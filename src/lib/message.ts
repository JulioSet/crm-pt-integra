import { prisma } from "./prisma";

export async function sendMessage(to: string, text: string) {
   const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, text }), // Send data as JSON
   });
   const data = await response.json()
   
   if (data.status === 500) {
      return false;
   }
}

export async function saveMessageToDatabase(from: string, text: string, timestamp: string, responder: string) { 
   // console.log(`From: ${from}`); # 6287732919
   // console.log(`Message: ${text}`); # this is message
   // console.log(`Timestamp: ${new Date(timestamp * 1000)}`); # Wed Nov 20 2024 16:53:39 GMT+0700 (Indochina Time)
   
   const check_message = await prisma.message_header.findFirst({
      where: {telepon: from}
   });

   if (check_message === null) {
      await prisma.message_header.create({
         data: {
            telepon: from,
            pesan_terbaru: text,
            waktu_terbaru: timestamp,
            label: 'new',
            akses: 'admin'
         }
      });
   }

   await prisma.message_content.create({
      data: {
         message_header_telepon: from,
         pesan: text,
         waktu: timestamp,
         responder: responder
      }
   })
}

export async function updateMessageHeader(phone: string, text: string, timestamp: string) {
   await prisma.message_header.update({
      where: {telepon: phone},
      data: {
         pesan_terbaru: text,
         waktu_terbaru: timestamp
      }
   })
}

export async function getConversations() {
   const response = await fetch('/api/chat/fetch', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}