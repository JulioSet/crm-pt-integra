import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
   const session = await getSession()
   const agent = session?.id as string
   const role =  session?.role as string
   
   try {
      let conversations;

      // this code is for employee that has head position
      const roleToSettingName: Record<string, string> = {
         sales: 'leader_sales',
         cs: 'leader_cs',
         tech: 'leader_tech'
      };
   
      const settingName = roleToSettingName[role];
      if (settingName) {
         const leader = await prisma.setting.upsert({
            where: { name: settingName },
            update: {},
            create: { name: settingName, value: '' }
         });

         if (leader?.value === agent) {
            conversations = await prisma.message_header.findMany({
               where: { role_penanggung_jawab: role },
               include: { message_content: true },
            });
         }
      }
      
      // this code is for normal employee
      if (!conversations) {
         conversations = await prisma.message_header.findMany({
            where: { 
               OR: [
                  { akses: agent },
                  { bala_bantuan: agent },
               ],
               AND: [
                  { persetujuan_delegasi_dari_admin: true },
               ]
            },
            include: { message_content: true },
         });
      }
      return NextResponse.json(conversations);
   } catch (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500}
      );
   }
}