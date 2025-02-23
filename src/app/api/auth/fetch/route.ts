import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const { role } = await req.json()
   
   const employee = await prisma.employee.findMany({
      where: { role: role },
      select: {
         id: true,
         name: true,
         target_deal: true,
         last_login: true
      }
   });
   
   return NextResponse.json({ status: 200, data: employee });
}