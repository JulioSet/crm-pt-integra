import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { id } = await req.json(); // Read the body data

   const data = await prisma.contact.findFirst({
      where: { id: id },
      select: {
         telepon: true
      }
   })
   
   const check_any_connected_message = await prisma.message_header.findFirst({
      where: { telepon: data?.telepon }
   })

   if (check_any_connected_message) {
      await prisma.message_header.update({
         where: { telepon: data?.telepon },
         data: {
            nama: null
         }
      })
   }
   
   await prisma.contact.delete({
      where: { id: id }
   });

   return NextResponse.json({ message: "success deleting contact" });
}