import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { id } = await req.json(); // Read the body data

   await prisma.room_chat_header.delete({
      where: { id: id }
   });

   return NextResponse.json({ message: "success deleting email complain" });
}

