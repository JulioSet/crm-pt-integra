import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { createSession } from "@/lib/session";
import { setGlobalSession } from "@/utils/global-session";

export async function POST(req: NextRequest) {
   const { name, password } = await req.json();

   const employee = await prisma.employee.findUnique({
      where: { name: name },
   });
   if (!employee) {
      return NextResponse.json({ status: 403 });
   }

   const verified = await bcrypt.compare(password, employee?.password);
   if (!verified) {
      return NextResponse.json({ status: 403 });
   }

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
      where: { name: name },
      data: { last_login: date }
   })

   // create session
   await createSession(employee.name, employee.role);

   // set session globally
   await setGlobalSession();

   return NextResponse.json({ status: 200, data: employee });
}