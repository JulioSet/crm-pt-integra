import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const responseTime = await prisma.setting.findFirst({
         where: { name: 'response' },
         select: { value: true }
      });

      if (!responseTime) {
         await prisma.setting.create({
            data: { name: 'response', value: '10000' }
         });
      }
      return NextResponse.json(responseTime || 10000);
   } catch (error) {
      console.error("Error fetching settings:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500}
      );
   }
}