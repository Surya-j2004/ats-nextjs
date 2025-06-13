import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const data = await req.json();

    // Convert skills string to array (if needed)
    if (typeof data.skills === "string") {
      data.skills = data.skills.split(",").map(s => s.trim());
    }

    // Ensure experience is an integer
    if (typeof data.experience === "string") {
      data.experience = parseInt(data.experience, 10);
    }

    // Get latest Job Description
    const jd = await prisma.jobDescription.findFirst({
      orderBy: { id: "desc" },
    });
    if (!jd) {
      return NextResponse.json({ error: "No job description found" }, { status: 404 });
    }

    // Calculate ATS score
    const resumeSkills = (data.skills || []).map(s => s.toLowerCase());
    const requiredSkills = (jd.requiredSkills || []).map(s => s.toLowerCase());
    const matchedSkills = requiredSkills.filter(skill => resumeSkills.includes(skill));
    const atsScore = requiredSkills.length
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        ...data,
        atsScore,
        jobDescriptionId: jd.id,
      },
    });

    return NextResponse.json({
      ...resume,
      matchedSkills,
    });
  } catch (err) {
    console.error("Error saving resume:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
