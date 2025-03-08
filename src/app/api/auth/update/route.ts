import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { id, name, target, email } = await req.json(); // Read the body data

   await prisma.employee.update({
      where: { id: id },
      data: {
         name: name,
         email: email,
         target_deal: parseInt(target)
      }
   });

   return NextResponse.json({ message: "success updating user" });
}

