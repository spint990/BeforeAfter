import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateParameterSchema } from "@/lib/validations";
import { z } from "zod";
import { logError } from "@/lib/error-utils";

// GET /api/parameters/[id] - Get a single parameter with all quality levels
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parameter = await prisma.parameter.findUnique({
      where: { id },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        qualityLevels: {
          orderBy: {
            level: "asc",
          },
        },
      },
    });

    if (!parameter) {
      return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
    }

    return NextResponse.json(parameter);
  } catch (error) {
    logError("Error fetching parameter:", error);
    return NextResponse.json({ error: "Failed to fetch parameter" }, { status: 500 });
  }
}

// PUT /api/parameters/[id] - Update a parameter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateParameterSchema.parse(body);

    // Check if parameter exists
    const existingParameter = await prisma.parameter.findUnique({
      where: { id },
    });

    if (!existingParameter) {
      return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
    }

    // Determine the target gameId for uniqueness check
    const targetGameId = validatedData.gameId || existingParameter.gameId;
    const targetSlug = validatedData.slug || existingParameter.slug;

    // Check for slug conflicts if slug or gameId is being changed
    if (
      (validatedData.slug && validatedData.slug !== existingParameter.slug) ||
      (validatedData.gameId && validatedData.gameId !== existingParameter.gameId)
    ) {
      const slugConflict = await prisma.parameter.findFirst({
        where: {
          gameId: targetGameId,
          slug: targetSlug,
          NOT: { id },
        },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "A parameter with this slug already exists for this game" },
          { status: 400 }
        );
      }
    }

    // If gameId is being changed, verify the new game exists
    if (validatedData.gameId && validatedData.gameId !== existingParameter.gameId) {
      const game = await prisma.game.findUnique({
        where: { id: validatedData.gameId },
      });
      if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }
    }

    const parameter = await prisma.parameter.update({
      where: { id },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.slug !== undefined && { slug: validatedData.slug }),
        ...(validatedData.gameId !== undefined && { gameId: validatedData.gameId }),
      },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(parameter);
  } catch (error) {
    logError("Error updating parameter:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update parameter" }, { status: 500 });
  }
}

// DELETE /api/parameters/[id] - Delete a parameter (cascade deletes quality levels)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if parameter exists
    const existingParameter = await prisma.parameter.findUnique({
      where: { id },
    });

    if (!existingParameter) {
      return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
    }

    // Delete the parameter (cascade is configured in schema)
    await prisma.parameter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Error deleting parameter:", error);
    return NextResponse.json({ error: "Failed to delete parameter" }, { status: 500 });
  }
}
