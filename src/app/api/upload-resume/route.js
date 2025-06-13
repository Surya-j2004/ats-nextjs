import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const jobDescription = formData.get("jobDescription");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}_${file.name}`;

  // Upload to S3 instead of local disk
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `resumes/${fileName}`,
      Body: buffer,
      ContentType: file.type,
    })
  );

  // Send the file to APILayer
  const response = await fetch("https://api.apilayer.com/resume_parser/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "apikey": process.env.APILAYER_API_KEY,
    },
    body: buffer,
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  const data = await response.json();

  // ATS scoring logic: only if JD/skills provided
  let atsScore = null;
  let matchedSkills = [];
  if (jobDescription) {
    const resumeSkills = (data.skills || []).map(s => s.toLowerCase());
    const requiredSkills = jobDescription
      ? jobDescription.split(/,|\n|\.|;/).map(s => s.trim().toLowerCase()).filter(Boolean)
      : [];
    matchedSkills = requiredSkills.filter(skill => resumeSkills.includes(skill));
    atsScore = requiredSkills.length
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;
  }

  // Return parsed data for human review, DO NOT SAVE TO DB
  return NextResponse.json({ ...data, fileName, atsScore, matchedSkills });
}
