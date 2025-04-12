import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { role, value } = await req.json(); // Read the body data

   const roleToSettingName: Record<string, string> = {
      sales: 'leader_sales',
      cs: 'leader_cs',
      tech: 'leader_tech'
   };

   const settingName = roleToSettingName[role];
   
   if (settingName) {
      await prisma.setting.update({
         where: { name: settingName },
         data: { value }
      });
   }

   return NextResponse.json({ message: "success assigning leader" });
}

