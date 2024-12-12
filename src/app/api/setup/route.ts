import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   const userCount = await prisma.employee.count();
   return NextResponse.json({ create: userCount < 1 }); // true or false 
}