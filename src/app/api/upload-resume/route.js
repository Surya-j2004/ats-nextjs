import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Fetch the latest Job Description by highest ID
    const jd = await prisma.jobDescription.findFirst({
      orderBy: { id: "desc" },
    });
    if (!jd) {
      return NextResponse.json({ error: "No job description found" }, { status: 404 });
    }

    // Upload to S3 instead of local filesystem
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}_${file.name}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `resumes/${fileName}`,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Rest of the existing parsing logic remains unchanged
    const apiRes = await fetch("https://api.apilayer.com/resume_parser/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "apikey": process.env.APILAYER_API_KEY,
      },
      body: buffer,
    });

    if (!apiRes.ok) {
      const error = await apiRes.text();
      return NextResponse.json({ error }, { status: apiRes.status });
    }
    const parsed = await apiRes.json();

    // Calculate ATS score for preview (not saved yet)
    const resumeSkills = (parsed.skills || []).map(s => s.toLowerCase());
    const requiredSkills = (jd.requiredSkills || []).map(s => s.toLowerCase());
    const matchedSkills = requiredSkills.filter(skill => resumeSkills.includes(skill));
    const atsScore = requiredSkills.length
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    return NextResponse.json({
      parsedData: {
        ...parsed,
        fileName,
      },
      preview: {
        atsScore,
        matchedSkills,
      }
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
