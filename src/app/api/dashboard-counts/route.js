// app/api/dashboard-counts/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [resumeCount, offerLetterCount, joiningLetterCount] = await Promise.all([
    prisma.resume.count(),
    prisma.offerLetter.count(),
    prisma.offerLetter.count({ where: { status: "Accepted" } }) // Joining letters = accepted offers
  ]);
  return NextResponse.json({
    resumes: resumeCount,
    offerLetters: offerLetterCount,
    joiningLetters: joiningLetterCount
  });
}
