export async function createComplain(email: string, name: string, complain: string) {
   const response = await fetch('/api/email_complain/create/complain', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, complain }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to create complain');
      return;
   }
}

export async function fetchComplains() {
   const response = await fetch('/api/email_complain/fetch/complain', {
      method: 'GET',
   });

   if (response.status === 500) {
      return false;
   }

   const data = await response.json()
   return data;
}

export async function sendRoomLink(id: string, to: string, text: string) {
   const response = await fetch('/api/email_complain/send_email', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, to, text }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to create complain');
      return;
   }
}

export async function fetchRoomChat(id: string) {
   const response = await fetch('/api/email_complain/fetch/room', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send data as JSON
   });

   if (response.status === 404) {
      console.error('Failed to fetch room chat');
      return;
   }

   const data = await response.json()
   return data;
} 

export async function deleteRoomChat(id: string) {
   const response = await fetch('/api/email_complain/delete', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send data as JSON
   });
   
   if (!response.ok) {
      console.error('Failed to delete email complain');
      return;
   }
}

export async function sendMessageRoomChat(id: string, text: string, responder: string) {
   const response = await fetch('/api/email_complain/send', {
      method: 'POST',  
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, text, responder }), // Send data as JSON
   });
   const data = await response.json()
   
   if (data.status === 500) {
      return false;
   } else {
      return true;
   }
}