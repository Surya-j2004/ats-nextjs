import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Dynamic imports to avoid webpack bundling issues
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    
    const formData = await req.formData();
    const file = formData.get("file");
    const jobDescription = formData.get("jobDescription");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Configure AWS S3 client
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      // Return success response
      return NextResponse.json({
        message: "File uploaded successfully",
        fileName: fileName,
        fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
      });

    } catch (s3Error) {
      console.error("S3 Upload Error:", s3Error);
      return NextResponse.json(
        { error: "Failed to upload file to S3" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
