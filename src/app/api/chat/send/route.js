import { saveMessageToDatabase, updateMessageHeader } from "@/lib/message";

export async function POST(req) { // It should be POST or GET
  try {
    const data = await req.json();
    
    // Send the data to the Glitch server
    const response = await fetch("https://planet-fine-xenon.glitch.me/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    // saving message to database
    if (response.status !== 500) {
      const { to, text, agent, timestamp, responseTime } = data;
      saveMessageToDatabase(to, text, timestamp, 'integra', agent, responseTime)
      updateMessageHeader(to, text, timestamp)
    }
    
    return new Response(JSON.stringify({ status: response.status }));
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ status: 500 }));
  }
}