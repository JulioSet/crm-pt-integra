import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { phone, answer } = await req.json(); // Read the body data

   await prisma.message_header.update({
      where: { telepon: phone },
      data: {
         persetujuan_delegasi_dari_admin: answer
      }
   });

   return NextResponse.json({ message: "success updating deadline" });
}

