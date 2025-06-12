import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

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

    // Save the file to /uploads
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const fileName = `${file.name}`;  // Added timestamp for uniqueness
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Parse resume with APILayer
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

    // Return parsed data for human review - NO DATABASE SAVE HERE
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
  } catch (_err) {
    console.error("Error uploading resume:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
