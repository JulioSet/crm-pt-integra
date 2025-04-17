import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { phone, name, agent, role, status } = await req.json(); // Read the body data
   const now = Math.floor(Date.now() / 1000)

   console.log(name)
   await prisma.delegation_history.create({
      data: {
         telepon: phone,
         nama: name,
         agent: agent,
         role: role,
         status: parseInt(status),
         waktu: now.toString(),
      }
   });

   return NextResponse.json({ message: "success logging delegation permission"});
}

