export async function POST(req) {
   try {
     const data = await req.json();
 
     // Send the data to the Glitch server
     const response = await fetch("https://your-glitch-url.glitch.me/api/webhook", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(data),
     });
 
     const result = await response.json();
 
     return new Response(JSON.stringify(result), { status: response.status });
   } catch (error) {
     console.error("Error sending message:", error);
     return new Response(
       JSON.stringify({ error: "Failed to send message to Glitch server" }),
       { status: 500 }
     );
   }
 }
 