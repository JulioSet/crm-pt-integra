import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   try {
      const { role } = await req.json(); // Read the body data

      const roleToSettingName: Record<string, string> = {
         sales: 'leader_sales',
         cs: 'leader_cs',
         tech: 'leader_tech'
      };
   
      const settingName = roleToSettingName[role];
      
      if (settingName) {
         const leader = await prisma.setting.findFirst({
            where: { name: settingName },
            select: { value: true }
         });
         if (!leader) {
            await prisma.setting.create({
               data: { name: settingName, value: '' }
            });
         }
         return NextResponse.json(leader || '');
      }

   } catch (error) {
      console.error("Error fetching settings:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500}
      );
   }
}