import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
   const { name, password } = await req.json();

   const employee = await prisma.employee.findUnique({
      where: { name },
   });
   if (!employee) {
      return NextResponse.json({ status: 403 });
   }

   const verified = await bcrypt.compare(password, employee?.password);
   if (!verified) {
      return NextResponse.json({ status: 403 });
   }

   // create session
   await createSession(employee.name, employee.role);

   return NextResponse.json({ status: 200, data: employee });
}