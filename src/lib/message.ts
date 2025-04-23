import { prisma } from "./prisma";

export async function createMessage(name: string, phone: string, agent: string) {
   await fetch('/api/chat/create', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone, agent }), // Send data as JSON
   });
}

export async function sendMessage(to: string, text: string, agent: string, timestamp: string, responseTime: string) {
   const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, text, agent, timestamp, responseTime }), // Send data as JSON
   });
   const data = await response.json()
   
   if (data.status === 500) {
      return false;
   } else {
      return true;
   }
}

export async function saveMessageToDatabase(from: string, text: string, timestamp: string, responder: string, agent: string, responseTime: string) { 
   // console.log(`From: ${from}`); # 6287732919
   // console.log(`Message: ${text}`); # this is message
   // console.log(`Timestamp: ${new Date(timestamp * 1000)}`); # Wed Nov 20 2024 16:53:39 GMT+0700 (Indochina Time)

   const check_message = await prisma.message_header.findFirst({
      where: {telepon: from}
   });

   if (check_message === null) {
      const contact = await prisma.contact.findFirst({
         where: {telepon: from},
         select: {
            nama: true
         }
      })

      await prisma.message_header.create({
         data: {
            telepon: from,
            nama: contact?.nama,
            pesan_terbaru: text,
            waktu_terbaru: timestamp,
            label: 'new',
            akses: 'resepsionis'
         }
      });
   }

   await prisma.message_content.create({
      data: {
         message_header_telepon: from,
         pesan: text,
         waktu: timestamp,
         waktu_respon: responseTime,
         agent: agent,
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

export async function assignMessage(phone: string, name: string, id: string, role_delegation: string) {
   await fetch('/api/chat/assign', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name, id, role_delegation }), // Send data as JSON
   });
}

export async function assignHelp(phone: string, id: string) {
   await fetch('/api/chat/help', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, id }), // Send data as JSON
   });
}

export async function assignTech(phone: string, id: string) {
   await fetch('/api/chat/tech', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, id }), // Send data as JSON
   });
}

export async function updateName (phone: string, name: string) {
   await fetch('/api/chat/update/name', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name }), // Send data as JSON
   });
}

export async function updateLabel (phone: string, label: string) {
   await fetch('/api/chat/update/label', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, label }), // Send data as JSON
   });
}

export async function updateNote (phone: string, note: string) {
   await fetch('/api/chat/update/note', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, note }), // Send data as JSON
   });
}

export async function updatePriority (phone: string, priority: string) {
   await fetch('/api/chat/update/priority', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, priority }), // Send data as JSON
   });
}

export async function updateDeadline (phone: string, date: string) {
   await fetch('/api/chat/update/deadline', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, date }), // Send data as JSON
   });
}

export async function updateRead (phone: string) {
   await fetch('/api/chat/update/read', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }), // Send data as JSON
   });
}

export async function updateDelegatePermission(phone: string, answer: number) {
   await fetch('/api/chat/update/delegate_permission', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, answer }), // Send data as JSON
   });
}

export async function fetchAllMessage() {
   const response = await fetch('/api/chat/all', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}

export async function setDateResolve(phone: string) {
   await fetch('/api/chat/resolve', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }), // Send data as JSON
   });
}