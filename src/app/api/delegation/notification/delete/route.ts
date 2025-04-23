import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
   const { id } = await req.json(); // Read the body data

   await prisma.delegation_notification.delete({
      where: { id }
   });

   return NextResponse.json({ message: "success deleting delegation notification"});
}

