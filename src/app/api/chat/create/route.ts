import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { name, phone, agent } = await req.json(); // Read the body data

   const check_message = await prisma.message_header.findFirst({
      where: {telepon: phone}
   });

   if (check_message === null) {
      await prisma.message_header.create({
         data: {
            nama: name,
            telepon: phone,
            label: 'ongoing',
            akses: agent
         }
      });
   }

   return NextResponse.json({ message: "success creating conversation"});
}

