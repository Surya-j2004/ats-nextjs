// File: src/app/api/resume/[id]/route.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate ID format
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid resume ID format' },
        { status: 400 }
      );
    }

    // Fetch resume metadata from DB
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(id) },
      select: { fileName: true }
    });

    if (!resume || !resume.fileName) {
      return NextResponse.json(
        { error: 'Resume not found in database' },
        { status: 404 }
      );
    }

    // Decode fileName in case it was URL-encoded
    const decodedFileName = decodeURIComponent(resume.fileName);

    // Normalize to lowercase if your system enforces it
    // const normalizedFileName = decodedFileName.toLowerCase();

    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'resumes', decodedFileName);

    // Check if file exists
    try {
      await fs.access(filePath, fs.constants.F_OK);
    } catch (_err) {
      console.error(`File not found at path: ${filePath}`);
      return NextResponse.json(
        { error: 'Resume file not found on server' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Optional: Validate PDF header (first 4 bytes should be '%PDF')
    if (!fileBuffer.slice(0, 4).equals(Buffer.from('%PDF'))) {
      return NextResponse.json(
        { error: 'Corrupted or invalid PDF file' },
        { status: 400 }
      );
    }

    // Serve the file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(decodedFileName)}`,
        'Content-Length': fileBuffer.length,
      },
    });

  } catch (_error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: _error.message },
      { status: 500 }
    );
  }
}
