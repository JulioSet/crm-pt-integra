import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
   const { phone, id } = await req.json(); // Read the body data

   await prisma.message_header.update({
      where: { telepon: phone },
      data: {
         akses: id
      }
   });

   const session = await getSession()
   const role = session?.role || ''
   const now = Math.floor(Date.now() / 1000)
   if (role === 'admin') {
      await prisma.message_header.update({
         where: { telepon: phone },
         data: {
            waktu_admin_delegasi: now.toString()
         }
      })
   }

   return NextResponse.json({ message: "success updating label" });
}

