import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const responseTime = await prisma.setting.upsert({
         where: { name: 'response' },
         update: {},
         create: { name: 'response', value: '180000' }
      });

      return NextResponse.json(responseTime);
   } catch (error) {
      console.error("Error fetching settings:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500}
      );
   }
}