import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const contacts = await prisma.contact.findMany();
      return NextResponse.json(contacts);
   } catch (error) {
      console.error("Error fetching contacts:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500 }
      );
   }
}