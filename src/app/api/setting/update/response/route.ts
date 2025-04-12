import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { value } = await req.json(); // Read the body data

   await prisma.setting.update({
      where: { name: 'response' },
      data: {
         value: value
      }
   });

   return NextResponse.json({ message: "success updating response time limit" });
}

