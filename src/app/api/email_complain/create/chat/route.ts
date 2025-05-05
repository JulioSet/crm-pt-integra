import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
   const { email, name, complain } = await req.json(); // Read the body data

   const data = await prisma.room_chat_header.create({
      data: {
         id: nanoid(),
         email: email,
         nama: name,
         keluhan: complain
      }
   });

   return NextResponse.json({ message: "success creating complain", data: data});
}

