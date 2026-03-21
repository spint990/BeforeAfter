import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logError } from "@/lib/error-utils";
import { unlink } from "fs/promises";
import { join } from "path";

// Rejection validation schema
const rejectPhotoSubmissionSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required").max(1000, "Reason is too long"),
});

// POST /api/submissions/photos/[id]/reject - Reject a photo submission (deletes it from DB)
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

    // Delete the associated image file if it exists
    if (submission.imageUrl) {
      try {
        const imagePath = join(process.cwd(), "public", submission.imageUrl);
        await unlink(imagePath);
      } catch (fileError) {
        // Log error but don't fail the request if file deletion fails
        logError("Warning: Could not delete image file:", fileError);
      }
    }

    // Delete the submission from the database to optimize storage
    await prisma.photoSubmission.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Photo submission rejected and deleted",
      rejectionReason: validatedData.reason,
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
