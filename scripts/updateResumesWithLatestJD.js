import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateResumesWithLatestJD() {
  const latestJDId = 24; // latest required skills id from JobDescription table

  const result = await prisma.resume.updateMany({
    data: {
      jobDescriptionId: latestJDId
    }
  });

  console.log(`Updated ${result.count} resumes with jobDescriptionId = ${latestJDId}`);
}

updateResumesWithLatestJD()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
