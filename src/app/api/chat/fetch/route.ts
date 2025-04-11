import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
   const session = await getSession()
   const agent = session?.id as string // if role is admin then agent is '' else agent's name
   
   try {
      const conversations = await prisma.message_header.findMany({
         where: { 
            OR: [
               { akses: agent },
               { bala_bantuan: agent }
            ]
         },
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