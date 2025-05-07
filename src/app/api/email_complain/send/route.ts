import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) { // It should be POST or GET
   try {
      const { id, text, responder } = await req.json();

      await prisma.room_chat_content.create({
         data: {
            room_chat_id: id,
            pesan: text,
            responder: responder
         }
      })
      
      return NextResponse.json({ msg: 'Success sending message!' });
   } catch (error) {
      console.error("Error sending message:", error);
      return NextResponse.json({ status: 500 });
   }
}