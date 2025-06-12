import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { title, description, requiredSkills } = await req.json();

    if (!title || !requiredSkills) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Correct Prisma syntax - use model name
    const jd = await prisma.jobDescription.create({
      data: {
        title,
        description: description || "", // Handle optional field
        requiredSkills,
      },
    });

    return NextResponse.json(jd);
  } catch (err) {
    console.error("Error saving job description:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
