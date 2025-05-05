import { sendEmailComplication } from '@/app/service/mailService';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
   const { id, to, text } = await req.json(); // Read the body data

   // send link email
   await sendEmailComplication(to, text)

   // change status if email has already sent
   await prisma.room_chat_header.update({
      where: { id },
      data: { status_terkirim: true }
   })

   return NextResponse.json({ message: "success sending link to client"});
}

