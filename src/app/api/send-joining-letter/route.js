import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Helper: Generate PDF using pdf-lib
async function generateJoiningLetterPDF({ email, name, position, joiningDate }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('Joining Letter', { x: 200, y: 350, size: 24, font, color: rgb(0,0,0) });
  page.drawText(`Dear ${name},`, { x: 50, y: 300, size: 16, font });
  page.drawText(`We are delighted to confirm your joining as ${position}.`, { x: 50, y: 270, size: 14, font });
  page.drawText(`Your official joining date is: ${joiningDate}`, { x: 50, y: 240, size: 14, font });
  page.drawText('We look forward to working with you!\n\nBest regards,\nHR Team', { x: 50, y: 200, size: 14, font });

  const pdfBytes = await pdfDoc.save();

  // Save to public/joining-letters/{email}.pdf
  const joiningLettersDir = path.join(process.cwd(), "public", "joining-letters");
  if (!fs.existsSync(joiningLettersDir)) {
    fs.mkdirSync(joiningLettersDir, { recursive: true });
  }
  const pdfPath = path.join(joiningLettersDir, `${email}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);
  return pdfPath;
}

export const runtime = "nodejs"; // ensure Node.js runtime

export async function POST(req) {
  try {
    const {  email, name, position, joiningDate } = await req.json();

    // 1. Generate PDF joining letter
    const pdfPath = await generateJoiningLetterPDF({ email, name, position, joiningDate });

    // 2. Configure Nodemailer transporter (Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_SERVER_USERNAME,
        pass: process.env.SMTP_SERVER_PASSWORD,
      },
    });

    console.log("Sending joining letter to:", email);

    // 3. Compose and send email
    const mailOptions = {
      from: `"HR Team" <${process.env.SMTP_SERVER_USERNAME}>`,
      to: email,
      subject: `Joining Letter for ${position}`,
      text: `Dear ${name},\n\nCongratulations! Please find your joining letter attached. Your joining date is ${joiningDate}.\n\nBest regards,\nHR Team`,
      attachments: [
        {
          filename: "JoiningLetter.pdf",
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
