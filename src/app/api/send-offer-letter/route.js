import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

// Helper: Generate PDF using pdf-lib
async function generateOfferLetterPDF({ email, name, position }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('Offer Letter', { x: 200, y: 350, size: 24, font, color: rgb(0,0,0) });
  page.drawText(`Dear ${name},`, { x: 50, y: 300, size: 16, font });
  page.drawText(`Congratulations! You have been offered the position of ${position}.`, { x: 50, y: 270, size: 14, font });
  page.drawText('Best regards,\nHR Team', { x: 50, y: 220, size: 14, font });

  const pdfBytes = await pdfDoc.save();

  // Save to public/offer-letters/{email}.pdf
  const offerLettersDir = path.join(process.cwd(), "public", "offer-letters");
  if (!fs.existsSync(offerLettersDir)) {
    fs.mkdirSync(offerLettersDir, { recursive: true });
  }
  const pdfPath = path.join(offerLettersDir, `${email}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);
  return pdfPath;
}

export const runtime = "nodejs"; // ensure Node.js runtime

export async function POST(req) {
  try {
    const { id, email, name, position } = await req.json();

    // 1. Generate PDF offer letter
    const pdfPath = await generateOfferLetterPDF({ email, name, position });

    // 2. Send the offer letter via email
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const acceptLink = `${baseUrl}/accept-offer?candidateId=${id}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_SERVER_USERNAME,
        pass: process.env.SMTP_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"HR Team" <${process.env.SMTP_SERVER_USERNAME}>`,
      to: email,
      subject: `Offer Letter for ${position}`,
      text: `Dear ${name},\n\nCongratulations! Please find your offer letter attached. To accept your offer, please click the following link:\n${acceptLink}\n\nBest regards,\nHR Team`,
      attachments: [
        {
          filename: "Offer letter.pdf",
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // 3. Save offer letter info to the database
    // You may want to check if 'id' is the resumeId or candidateId
    // Adjust the field mapping as per your schema
    const saved = await prisma.offerLetter.create({
      data: {
        resumeId: id,               // Adjust if needed
        jobTitle: position,
        sentDate: new Date(),       // Current date/time
        status: "Sent",             // Or any status logic you want
      },
    });

    return NextResponse.json({ success: true, offerLetterId: saved.id });
  } catch (_error) {
    console.error("Email send/save error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
