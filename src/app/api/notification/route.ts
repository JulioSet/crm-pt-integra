import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/service/mailService";

export async function POST(req: NextRequest) {
   const { to, text } = await req.json();
   const result = await sendEmail(to, text);
   return NextResponse.json(result);
}
