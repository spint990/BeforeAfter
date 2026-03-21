import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logError } from "@/lib/error-utils";

// Rejection validation schema
const rejectPhotoSubmissionSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required").max(1000, "Reason is too long"),
});

// POST /api/submissions/photos/[id]/reject - Reject a photo submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = rejectPhotoSubmissionSchema.parse(body);

    // Check if submission exists and is PENDING
    const submission = await prisma.photoSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "Photo submission not found" }, { status: 404 });
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only reject submissions with PENDING status" },
        { status: 400 }
      );
    }

    // Update submission status to REJECTED and store reason
    const updatedSubmission = await prisma.photoSubmission.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: validatedData.reason,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Photo submission rejected",
      submission: updatedSubmission,
    });
  } catch (error) {
    logError("Error rejecting photo submission:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to reject photo submission" }, { status: 500 });
  }
}
