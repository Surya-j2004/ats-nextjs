import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(request, { params }) {
  const { filename } = params;

  // Enhanced filename validation
  if (!/^[\w-]+\.pdf$/i.test(filename)) {
    return NextResponse.json(
      { error: "Invalid filename format" },
      { status: 400 }
    );
  }

  try {
    // Generate presigned URL for secure access
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `resumes/${filename}`,
      ResponseContentDisposition: `inline; filename="${filename}"`,
    });

    // Option 1: Direct file streaming (recommended)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return NextResponse.redirect(url);

    // Option 2: Serve file buffer directly
    // const { Body } = await s3Client.send(command);
    // return new NextResponse(Body, {
    //   headers: {
    //     "Content-Type": "application/pdf",
    //     "Content-Disposition": `inline; filename="${filename}"`,
    //   },
    // });
  } catch (error) {
    console.error("S3 Error:", error);
    return NextResponse.json(
      { error: "File not found or access denied" },
      { status: 404 }
    );
  }
}
