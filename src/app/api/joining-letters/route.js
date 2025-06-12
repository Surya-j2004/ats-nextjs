import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns all joining letters with Resume info
export async function GET() {
  const joiningLetters = await prisma.offerLetter.findMany({
    include: { Resume: true }
  });
  return NextResponse.json(
    joiningLetters.map(jl => ({
      id: jl.id,
      name: jl.Resume?.name || "",         // Ensure name is always present
      position: jl.jobTitle || "",         // Ensure position is always present
      sentDate: jl.sentDate,
      status: jl.status,
      email: jl.Resume?.email || "",
      resumeId: jl.resumeId
    }))
  );
}
