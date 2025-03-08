import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   const admin = await prisma.employee.findFirst({ where: { role: 'admin' } });
   return NextResponse.json({ create: admin ? true : false }); // true or false 
}