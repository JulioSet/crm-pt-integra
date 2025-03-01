import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { phone, note } = await req.json(); // Read the body data

   await prisma.message_header.update({
      where: { telepon: phone },
      data: {
         catatan: note
      }
   });

   return NextResponse.json({ message: "success updating note" });
}

