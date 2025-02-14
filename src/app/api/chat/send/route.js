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
    const { to, text } = data;
    const timestamp = Math.floor(Date.now() / 1000).toString()
    saveMessageToDatabase(to, text, timestamp, 'integra')
    updateMessageHeader(to, text, timestamp)

    return new Response({ status: response.status });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send message to Glitch server" }),
      { status: 500 }
    );
  }
}