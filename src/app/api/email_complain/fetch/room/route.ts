import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const { id } = await req.json()
   
   try {
      const room = await prisma.room_chat_header.findFirst({
         where: { id },
         include: { room_chat_content: true }
      });
      
      return NextResponse.json({ status: 200, data: room });
      
   } catch (error) {
      return NextResponse.json({ status: 404, msg: error });
   }
}