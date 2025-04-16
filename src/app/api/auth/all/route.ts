import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const employees = await prisma.employee.findMany();
      return NextResponse.json(employees);
   } catch (error) {
      console.error("Error fetching employees:", error);
      return NextResponse.json(
         { error: "Internal Server Error" },
         { status: 500}
      );
   }
}