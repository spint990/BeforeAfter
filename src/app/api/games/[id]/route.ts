import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateGameSchema } from "@/lib/validations";
import { z } from "zod";

// Helper function to check if string is a valid CUID
function isCuid(id: string): boolean {
  return /^c[a-z0-9]{24}$/.test(id);
}

// GET /api/games/[id] - Get a single game by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    const game = await prisma.game.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        parameters: {
          include: {
            qualityLevels: {
              orderBy: {
                level: "asc",
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}

// PUT /api/games/[id] - Update a game by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateGameSchema.parse(body);

    // Check if game exists
    const existingGame = await prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // If slug is being updated, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingGame.slug) {
      const slugConflict = await prisma.game.findUnique({
        where: { slug: validatedData.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: "A game with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const game = await prisma.game.update({
      where: { id },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.slug !== undefined && { slug: validatedData.slug }),
        ...(validatedData.coverImage !== undefined && {
          coverImage: validatedData.coverImage || null,
        }),
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error updating game:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
}

// DELETE /api/games/[id] - Delete a game by ID (cascade deletes parameters and quality levels)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if game exists
    const existingGame = await prisma.game.findUnique({
      where: { id },
    });

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Delete the game (cascade is configured in schema)
    await prisma.game.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }
}
