import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { candidateId } = await req.json();
    if (!candidateId) {
      return NextResponse.json({ error: "candidateId is required" }, { status: 400 });
    }

    // Check if the OfferLetter exists
    const offer = await prisma.offerLetter.findUnique({
      where: { id: Number(candidateId) }
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer letter not found." }, { status: 404 });
    }


    // Try to update the offer letter status
    await prisma.offerLetter.update({
    where: { id: Number(candidateId) },
    data: { status: "Accepted" }
  });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Accept offer error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
