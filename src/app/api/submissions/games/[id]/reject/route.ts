import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logError } from "@/lib/error-utils";

// Rejection validation schema
const rejectGameSubmissionSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required").max(1000, "Reason is too long"),
});

// POST /api/submissions/games/[id]/reject - Reject a game submission (deletes it from DB)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = rejectGameSubmissionSchema.parse(body);

    // Check if submission exists and is PENDING
    const submission = await prisma.gameSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "Game submission not found" }, { status: 404 });
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only reject submissions with PENDING status" },
        { status: 400 }
      );
    }

    // Delete the submission from the database to optimize storage
    await prisma.gameSubmission.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Game submission rejected and deleted",
      rejectionReason: validatedData.reason,
    });
  } catch (error) {
    logError("Error rejecting game submission:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to reject game submission" }, { status: 500 });
  }
}
