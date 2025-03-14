export async function sendMail(to: string, text: string) {
   await fetch('/api/notification', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, text }), // Send data as JSON
   });
}