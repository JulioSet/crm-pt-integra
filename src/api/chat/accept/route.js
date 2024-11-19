export default async function handler(req, res) {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2))
  //  if (req.method === "POST") {
  //    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
 
  //    if (message?.type === "text") {
  //      const { from, id, text } = message;
 
  //      // Save the message to your database
  //      await saveMessageToDatabase({ from, id, text: text.body });
  //    }
 
  //    res.status(200).json({ success: true, message: "Message received from Glitch and saved." });
  //  } else {
  //    res.status(405).json({ message: "Method not allowed" });
  //  }
 }
 
 async function saveMessageToDatabase(messageData) {
   // Database logic to store the incoming message
   
 }
 