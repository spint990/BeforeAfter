import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGameSchema, paginationSchema } from "@/lib/validations";
import { logError } from "@/lib/error-utils";
import { z } from "zod";

// GET /api/games - List all games with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { skip, take } = paginationSchema.parse({
      skip: searchParams.get("skip"),
      take: searchParams.get("take"),
    });

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        skip,
        take,
        include: {
          parameters: {
            include: {
              _count: {
                select: { qualityLevels: true },
              },
            },
          },
          _count: {
            select: { parameters: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.game.count(),
    ]);

    return NextResponse.json({
      games,
      total,
    });
  } catch (error) {
    logError("Error fetching games:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

// POST /api/games - Create a new game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createGameSchema.parse(body);

    // Check if slug already exists
    const existingGame = await prisma.game.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "A game with this slug already exists" },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        coverImage: validatedData.coverImage || null,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    logError("Error creating game:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
