import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Dynamic imports to avoid webpack bundling issues
    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    
    const { filename } = params;

    // Enhanced filename validation
    if (!/^[\w\-]+\.pdf$/i.test(filename)) {
      return NextResponse.json(
        { error: "Invalid filename format" },
        { status: 400 }
      );
    }

    // Configure AWS S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filename,
      });

      // Generate presigned URL for secure access
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      return NextResponse.json({ url: signedUrl });
    } catch (s3Error) {
      console.error("S3 Error:", s3Error);
      
      if (s3Error.name === 'NoSuchKey') {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to retrieve file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Import or general error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
