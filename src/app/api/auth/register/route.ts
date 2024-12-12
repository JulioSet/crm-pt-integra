import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

const nanoid = customAlphabet('1234567890', 10) // id

export async function POST(req: NextRequest) {
   const { name, password, role } = await req.json(); // Read the body data

   // parameter
   const id = nanoid();
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

