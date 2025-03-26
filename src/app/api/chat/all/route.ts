import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const conversations = await prisma.message_header.findMany({
         include: { message_content: true },
      });
      return NextResponse.json(conversations);
   } catch (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500}
      );
   }
}