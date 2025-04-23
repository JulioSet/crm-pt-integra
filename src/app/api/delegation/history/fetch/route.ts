import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const data = await prisma.delegation_history.findMany();
      return NextResponse.json(data);
   } catch (error) {
      console.error("Error fetching delegation history:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500}
      );
   }
}