import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { phone } = await req.json(); // Read the body data
   const now = Math.floor(Date.now() / 1000)

   await prisma.message_header.update({
      where: { telepon: phone },
      data: {
         waktu_resolusi: now.toString()
      }
   });

   return NextResponse.json({ message: "success resolve" });
}

