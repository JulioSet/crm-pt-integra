import { saveMessageToDatabase, updateMessageHeader } from "@/lib/message";

export async function POST(req) { // It should be POST or GET
  try {
    const data = await req.json(); // Parse the incoming JSON
    console.log("Received data:", data);

    // saving message to database
    const { from, text, timestamp } = data;
    saveMessageToDatabase(from, text, timestamp, 'client');
    updateMessageHeader(from, text, timestamp)

    return new Response(JSON.stringify({ status: "Message processed successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
