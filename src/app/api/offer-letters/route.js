import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Returns all offer letters with Resume info
export async function GET() {
  const offerLetters = await prisma.offerLetter.findMany({
    include: { Resume: true }
  });
  return NextResponse.json(
    offerLetters.map(ol => ({
      id: ol.id,
      name: ol.Resume?.name || "",
      position: ol.jobTitle || "",
      sentDate: ol.sentDate,
      status: ol.status,
      email: ol.Resume?.email || "",
      resumeId: ol.resumeId
    }))
  );
}

// POST: Save a new offer letter to the database
export async function POST(req) {
  try {
    const { resumeId, jobTitle, sentDate, status } = await req.json();

    // Validate required fields
    if (!resumeId || !jobTitle || !sentDate || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new offer letter in DB
    const newOfferLetter = await prisma.offerLetter.create({
      data: {
        resumeId,
        jobTitle,
        sentDate: new Date(sentDate),
        status,
      },
      include: { Resume: true }
    });

    // Respond with the created offer letter (with Resume info)
    return NextResponse.json({
      id: newOfferLetter.id,
      name: newOfferLetter.Resume?.name || "",
      position: newOfferLetter.jobTitle || "",
      sentDate: newOfferLetter.sentDate,
      status: newOfferLetter.status,
      email: newOfferLetter.Resume?.email || "",
      resumeId: newOfferLetter.resumeId
    }, { status: 201 });

  } catch (error) {
    console.error("Error saving offer letter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
