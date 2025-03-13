import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
   const { email, password } = await req.json();

   const employee = await prisma.employee.findUnique({
      where: { email: email },
   });
   if (!employee) {
      return NextResponse.json({ status: 403 });
   }

   const verified = await bcrypt.compare(password, employee?.password);
   if (!verified) {
      return NextResponse.json({ status: 403 });
   }
   
   // create session
   await createSession(employee.id, employee.role);
   
   // update login date
   const date = new Date().toLocaleDateString("en-GB", { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      day: "2-digit",
      month: "long",
      year: "numeric",
   })
   await prisma.employee.update({
      where: { email: email },
      data: { last_login: date }
   })


   return NextResponse.json({ status: 200, data: employee });
}