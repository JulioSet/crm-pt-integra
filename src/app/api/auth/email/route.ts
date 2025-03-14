import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const { id } = await req.json()
   
   const employee = await prisma.employee.findFirst({
      where: { id: id },
      select: {
         name: true,
         email: true
      },
   });
   
   return NextResponse.json(employee);
}