import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/submissions/photos/[id]/approve - Approve a photo submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if submission exists and is PENDING
    const submission = await prisma.photoSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "Photo submission not found" }, { status: 404 });
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only approve submissions with PENDING status" },
        { status: 400 }
      );
    }

    // Verify that the game, parameter, and quality level still exist
    const [game, parameter, qualityLevel] = await Promise.all([
      prisma.game.findUnique({ where: { id: submission.gameId } }),
      submission.parameterId ? prisma.parameter.findUnique({ where: { id: submission.parameterId } }) : null,
      submission.qualityLevelId ? prisma.qualityLevel.findUnique({ where: { id: submission.qualityLevelId } }) : null,
    ]);

    if (!game) {
      return NextResponse.json({ error: "Associated game not found" }, { status: 404 });
    }
    if (submission.parameterId && !parameter) {
      return NextResponse.json({ error: "Associated parameter not found" }, { status: 404 });
    }
    if (submission.qualityLevelId && !qualityLevel) {
      return NextResponse.json({ error: "Associated quality level not found" }, { status: 404 });
    }

    // Create the photo and update submission in a transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Create new Photo from submission data
      const photo = await tx.photo.create({
        data: {
          gameId: submission.gameId,
          parameterId: submission.parameterId,
          qualityLevelId: submission.qualityLevelId,
          imageUrl: submission.imageUrl,
          description: submission.description,
        },
      });

      // Update submission status to APPROVED and link to created photo
      const updatedSubmission = await tx.photoSubmission.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          photoId: photo.id,
        },
      });

      return { photo, submission: updatedSubmission };
    });

    return NextResponse.json({
      message: "Photo submission approved successfully",
      photo: result.photo,
      submission: result.submission,
    });
  } catch (error) {
    console.error("Error approving photo submission:", error);
    return NextResponse.json({ error: "Failed to approve photo submission" }, { status: 500 });
  }
}
