import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(request, { params }) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "uploads", filename);
  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.log("Looking for file:", filePath);

    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
