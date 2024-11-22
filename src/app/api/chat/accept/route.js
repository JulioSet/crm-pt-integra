export async function POST(req) { // It should be POST or GET
  try {
    const data = await req.json(); // Parse the incoming JSON
    console.log("Received data:", data);

    // saving message to database
    saveMessageToDatabase(data);

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

async function saveMessageToDatabase(messageData) {
  const { messageId, from, text, timestamp } = messageData;

  // console.log(`From: ${from}`); # 6287732919
  // console.log(`Message: ${text}`); # this is message
  // console.log(`Timestamp: ${new Date(timestamp * 1000)}`); # Wed Nov 20 2024 16:53:39 GMT+0700 (Indochina Time)


}
