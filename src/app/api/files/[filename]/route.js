import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export async function GET(request, { params }) {
  const { filename } = params;

  // Basic filename validation: only allow filenames with letters, numbers, dashes, underscores, and .pdf extension
  if (!/^[\w\-]+\.(pdf)$/i.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filePath = path.join(UPLOADS_DIR, filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (_err) {
    // Don't log sensitive file paths in production
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
