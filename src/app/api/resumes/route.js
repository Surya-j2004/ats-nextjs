import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch the latest Job Description (by highest id)
    const jd = await prisma.jobDescription.findFirst({
      orderBy: { id: "desc" },
    });

    // Get required skills from latest JD (lowercased for matching)
    const requiredSkills = (jd?.requiredSkills || []).map(s => s.toLowerCase());

    // Fetch all resumes
    const resumes = await prisma.resume.findMany();

    // For each resume, calculate ATS score on the fly
    const resumesWithScore = resumes.map(resume => {
      const resumeSkills = (resume.skills || []).map(s => s.toLowerCase());
      const matchedSkills = requiredSkills.filter(skill => resumeSkills.includes(skill));
      const atsScore = requiredSkills.length
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0;
      return {
        ...resume,
        atsScore,
        matchedSkills,
      };
    });

    return NextResponse.json(resumesWithScore);
  } catch (_err) {
    console.error("Failed to fetch resumes:", err);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}
