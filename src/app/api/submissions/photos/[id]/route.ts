import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/error-utils";
import { z } from "zod";

// Update photo submission validation schema
const updatePhotoSubmissionSchema = z.object({
  gameId: z.string().min(1, "Game ID is required").optional(),
  parameterId: z.string().min(1, "Parameter ID is required").optional(),
  qualityLevelId: z.string().min(1, "Quality Level ID is required").optional(),
  imageUrl: z.string().url("Image URL must be a valid URL").optional(),
  description: z.string().max(1000, "Description is too long").optional().nullable(),
  submittedBy: z.string().max(255, "Submitter name is too long").optional().nullable(),
});

// GET /api/submissions/photos/[id] - Get a single photo submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await prisma.photoSubmission.findUnique({
      where: { id },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
            coverImage: true,
          },
        },
        parameter: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        qualityLevel: {
          select: {
            id: true,
            level: true,
            imageUrl: true,
          },
        },
        photo: {
          select: {
            id: true,
            imageUrl: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Photo submission not found" }, { status: 404 });
    }

    // Transform to include parsed custom parameter data
    let parsedOptions: string[] = [];
    try {
      parsedOptions = submission.customParameterOptions 
        ? JSON.parse(submission.customParameterOptions) 
        : [];
    } catch (e) {
      console.error('Failed to parse customParameterOptions:', e);
      parsedOptions = [];
    }
    
    const transformedSubmission = {
      ...submission,
      customParameter: submission.customParameterName ? {
        name: submission.customParameterName,
        options: parsedOptions,
        selectedOption: submission.customParameterSelected || '',
      } : undefined,
    };

    return NextResponse.json(transformedSubmission);
  } catch (error) {
    logError("Error fetching photo submission:", error);
    return NextResponse.json({ error: "Failed to fetch photo submission" }, { status: 500 });
  }
}

// PATCH /api/submissions/photos/[id] - Update a photo submission (only if PENDING)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updatePhotoSubmissionSchema.parse(body);

    // Check if submission exists and is PENDING
    const existingSubmission = await prisma.photoSubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: "Photo submission not found" }, { status: 404 });
    }

    if (existingSubmission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only update submissions with PENDING status" },
        { status: 400 }
      );
    }

    // Validate game exists if being updated
    if (validatedData.gameId) {
      const game = await prisma.game.findUnique({
        where: { id: validatedData.gameId },
      });

      if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }
    }

    // Validate parameter exists and belongs to the game if being updated
    if (validatedData.parameterId) {
      const parameter = await prisma.parameter.findUnique({
        where: { id: validatedData.parameterId },
      });

      if (!parameter) {
        return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
      }

      const gameId = validatedData.gameId || existingSubmission.gameId;
      if (parameter.gameId !== gameId) {
        return NextResponse.json(
          { error: "Parameter does not belong to the specified game" },
          { status: 400 }
        );
      }
    }

    // Validate quality level exists and belongs to the parameter if being updated
    if (validatedData.qualityLevelId) {
      const qualityLevel = await prisma.qualityLevel.findUnique({
        where: { id: validatedData.qualityLevelId },
      });

      if (!qualityLevel) {
        return NextResponse.json({ error: "Quality level not found" }, { status: 404 });
      }

      const parameterId = validatedData.parameterId || existingSubmission.parameterId;
      if (qualityLevel.parameterId !== parameterId) {
        return NextResponse.json(
          { error: "Quality level does not belong to the specified parameter" },
          { status: 400 }
        );
      }
    }

    // Build update data object
    const updateData: Record<string, unknown> = {};
    if (validatedData.gameId !== undefined) updateData.gameId = validatedData.gameId;
    if (validatedData.parameterId !== undefined) updateData.parameterId = validatedData.parameterId;
    if (validatedData.qualityLevelId !== undefined) updateData.qualityLevelId = validatedData.qualityLevelId;
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.submittedBy !== undefined) updateData.submittedBy = validatedData.submittedBy;

    const submission = await prisma.photoSubmission.update({
      where: { id },
      data: updateData,
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        parameter: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        qualityLevel: {
          select: {
            id: true,
            level: true,
          },
        },
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    logError("Error updating photo submission:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update photo submission" }, { status: 500 });
  }
}

// DELETE /api/submissions/photos/[id] - Delete a photo submission (only if PENDING)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if submission exists and is PENDING
    const existingSubmission = await prisma.photoSubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: "Photo submission not found" }, { status: 404 });
    }

    if (existingSubmission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only delete submissions with PENDING status" },
        { status: 400 }
      );
    }

    await prisma.photoSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Photo submission deleted successfully" });
  } catch (error) {
    logError("Error deleting photo submission:", error);
    return NextResponse.json({ error: "Failed to delete photo submission" }, { status: 500 });
  }
}
