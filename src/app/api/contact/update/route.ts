import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { id, name, phone } = await req.json(); // Read the body data

   await prisma.contact.update({
      where: { id: id },
      data: {
         nama: name,
         telepon: phone
      }
   });

   return NextResponse.json({ message: "success updating contact" });
}