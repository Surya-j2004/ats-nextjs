import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const jobDescription = formData.get("jobDescription"); // May be null

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Save file temporarily if needed for review
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!(await fs.stat(uploadsDir).catch(() => false))) {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);

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
