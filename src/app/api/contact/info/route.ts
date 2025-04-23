import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { phone } = await req.json(); // Read the body data

   const data = await prisma.contact.findFirst({
      where: { telepon: phone },
   });

   return NextResponse.json(data);
}