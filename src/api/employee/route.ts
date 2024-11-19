import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

export async function post(name: string, password: string) {
   const newUser = await prisma.employee.create({
      data: {
         id: nanoid(),
         name,
         password
      }
   })
   return NextResponse.json(newUser)
}