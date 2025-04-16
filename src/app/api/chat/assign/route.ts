import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
   const { phone, id, role_delegation } = await req.json(); // Read the body data

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
            role_penanggung_jawab: role_delegation,
            persetujuan_delegasi_dari_admin: 1,
            waktu_admin_delegasi: now.toString(),
         }
      })
   }

   return NextResponse.json({ message: "success delegating conversation" });
}

