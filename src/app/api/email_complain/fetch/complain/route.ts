import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const complains = await prisma.room_chat_header.findMany();
      return NextResponse.json(complains);
   } catch (error) {
      console.error("Error fetching complains:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}