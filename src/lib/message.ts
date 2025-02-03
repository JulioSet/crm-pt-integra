export async function sendMessage(to: string, text: string) {
   const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, text }), // Send data as JSON
   });

   if (!response.ok) {
      console.error('Failed to send message');
      return;
   }
}