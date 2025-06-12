import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function recalculateATS() {
  const latestJD = await prisma.jobDescription.findFirst({ orderBy: { id: "desc" } });
  if (!latestJD) throw new Error("No JD found");
  const requiredSkills = (latestJD.requiredSkills || []).map(s => s.toLowerCase());
  const resumes = await prisma.resume.findMany();

  for (const resume of resumes) {
    const resumeSkills = (resume.skills || []).map(s => s.toLowerCase());
    const matchedSkills = requiredSkills.filter(skill => resumeSkills.includes(skill));
    const atsScore = requiredSkills.length
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;
    await prisma.resume.update({
      where: { id: resume.id },
      data: { atsScore }
    });
  }
  console.log("ATS scores recalculated!");
}

recalculateATS()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
