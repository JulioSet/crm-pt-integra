import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
   const { phone, name, id, role_delegation } = await req.json(); // Read the body data

   await prisma.message_header.update({
      where: { telepon: phone },
      data: {
         akses: id
      }
   });

   const session = await getSession()
   const role = session?.role || ''
   const agent = await prisma.employee.findFirst({
      where: { id },
      select: { name: true }
   })
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
   } else {
      await prisma.message_header.update({
         where: { telepon: phone },
         data: {
            persetujuan_delegasi_dari_admin: 2
         }
      })
      await prisma.delegation_history.create({
         data: {
            telepon: phone,
            nama: name,
            agent: agent?.name || "",
            role: typeof role === 'string' ? role : 'unknown',
            status: 2,
            waktu: now.toString(),
         }
      });
   }

   return NextResponse.json({ message: "success delegating conversation" });
}

