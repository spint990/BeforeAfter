import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createParameterSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/parameters - List all parameters (optional gameId filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    const where = gameId ? { gameId } : {};

    const parameters = await prisma.parameter.findMany({
      where,
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
        _count: {
          select: { qualityLevels: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      data: parameters,
    });
  } catch (error) {
    console.error("Error fetching parameters:", error);
    return NextResponse.json({ error: "Failed to fetch parameters" }, { status: 500 });
  }
}

// POST /api/parameters - Create a new parameter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createParameterSchema.parse(body);

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { id: validatedData.gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Check if parameter with same slug exists for this game
    const existingParameter = await prisma.parameter.findFirst({
      where: {
        gameId: validatedData.gameId,
        slug: validatedData.slug,
      },
    });

    if (existingParameter) {
      return NextResponse.json(
        { error: "A parameter with this slug already exists for this game" },
        { status: 400 }
      );
    }

    const parameter = await prisma.parameter.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        gameId: validatedData.gameId,
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

    return NextResponse.json(parameter, { status: 201 });
  } catch (error) {
    console.error("Error creating parameter:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create parameter" }, { status: 500 });
  }
}
