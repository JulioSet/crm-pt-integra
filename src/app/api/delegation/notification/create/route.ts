import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { phone, name, agent_now, agent_before, reason } = await req.json(); // Read the body data

   await prisma.delegation_notification.create({
      data: {
         telepon: phone,
         nama: name,
         agen_sekarang: agent_now,
         agen_sebelum: agent_before,
         alasan: reason
      }
   });

   return NextResponse.json({ message: "success logging delegation permission"});
}

