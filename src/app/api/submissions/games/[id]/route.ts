import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/error-utils";
import { z } from "zod";

// Update game submission validation schema
const updateGameSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  releaseYear: z.number().int().min(1970).max(new Date().getFullYear() + 5).optional().nullable(),
  coverImageUrl: z.string().url("Cover image must be a valid URL").optional().nullable().or(z.literal("")),
});

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/submissions/games/[id] - Get a single game submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await prisma.gameSubmission.findUnique({
      where: { id },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
            coverImage: true,
            createdAt: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Game submission not found" }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    logError("Error fetching game submission:", error);
    return NextResponse.json({ error: "Failed to fetch game submission" }, { status: 500 });
  }
}

// PATCH /api/submissions/games/[id] - Update a game submission (only if PENDING)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateGameSubmissionSchema.parse(body);

    // Check if submission exists and is PENDING
    const existingSubmission = await prisma.gameSubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: "Game submission not found" }, { status: 404 });
    }

    if (existingSubmission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only update submissions with PENDING status" },
        { status: 400 }
      );
    }

    // If name is being updated and no slug provided, generate new slug
    let slug = validatedData.slug;
    if (validatedData.name && !slug) {
      slug = generateSlug(validatedData.name);
    }

    // Check if new slug conflicts with existing games or submissions
    if (slug && slug !== existingSubmission.slug) {
      const existingGame = await prisma.game.findUnique({
        where: { slug },
      });

      if (existingGame) {
        return NextResponse.json(
          { error: "A game with this slug already exists" },
          { status: 400 }
        );
      }

      const existingSubmissionWithSlug = await prisma.gameSubmission.findUnique({
        where: { slug },
      });

      if (existingSubmissionWithSlug) {
        return NextResponse.json(
          { error: "A submission with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Build update data object
    const updateData: Record<string, unknown> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (slug !== undefined) updateData.slug = slug;
    if (validatedData.releaseYear !== undefined) updateData.releaseYear = validatedData.releaseYear;
    if (validatedData.coverImageUrl !== undefined) updateData.coverImageUrl = validatedData.coverImageUrl;

    const submission = await prisma.gameSubmission.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(submission);
  } catch (error) {
    logError("Error updating game submission:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update game submission" }, { status: 500 });
  }
}

// DELETE /api/submissions/games/[id] - Delete a game submission (only if PENDING)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if submission exists and is PENDING
    const existingSubmission = await prisma.gameSubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: "Game submission not found" }, { status: 404 });
    }

    if (existingSubmission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only delete submissions with PENDING status" },
        { status: 400 }
      );
    }

    await prisma.gameSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Game submission deleted successfully" });
  } catch (error) {
    logError("Error deleting game submission:", error);
    return NextResponse.json({ error: "Failed to delete game submission" }, { status: 500 });
  }
}
