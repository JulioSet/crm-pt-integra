import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { id, name, phone } = await req.json(); // Read the body data

   const contact = await prisma.contact.create({
      data: {
         id: id,
         nama: name,
         telepon: phone
      }
   });

   return NextResponse.json({ message: "success creating contact", data: contact});
}

