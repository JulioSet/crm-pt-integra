import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
   const { id, name, password, role } = await req.json(); // Read the body data

   const hashedPassword = await bcrypt.hash(password, 10);
   const employee = await prisma.employee.create({
      data: {
         id,
         name,
         password: hashedPassword,
         role
      }
   });

   return NextResponse.json({ message: "success creating user", data: employee});
}

