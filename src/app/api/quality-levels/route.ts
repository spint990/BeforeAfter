import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createQualityLevelSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/quality-levels - List all quality levels (optional parameterId filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parameterId = searchParams.get("parameterId");

    const where = parameterId ? { parameterId } : {};

    const qualityLevels = await prisma.qualityLevel.findMany({
      where,
      include: {
        parameter: {
          select: {
            id: true,
            name: true,
            slug: true,
            game: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        level: "asc",
      },
    });

    return NextResponse.json({
      data: qualityLevels,
    });
  } catch (error) {
    console.error("Error fetching quality levels:", error);
    return NextResponse.json({ error: "Failed to fetch quality levels" }, { status: 500 });
  }
}

// POST /api/quality-levels - Create a new quality level
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createQualityLevelSchema.parse(body);

    // Check if parameter exists
    const parameter = await prisma.parameter.findUnique({
      where: { id: validatedData.parameterId },
    });

    if (!parameter) {
      return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
    }

    // Check if quality level with same level exists for this parameter
    const existingLevel = await prisma.qualityLevel.findFirst({
      where: {
        parameterId: validatedData.parameterId,
        level: validatedData.level,
      },
    });

    if (existingLevel) {
      return NextResponse.json(
        { error: "A quality level with this level already exists for this parameter" },
        { status: 400 }
      );
    }

    const qualityLevel = await prisma.qualityLevel.create({
      data: {
        level: validatedData.level,
        imageUrl: validatedData.imageUrl,
        parameterId: validatedData.parameterId,
      },
      include: {
        parameter: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(qualityLevel, { status: 201 });
  } catch (error) {
    console.error("Error creating quality level:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create quality level" }, { status: 500 });
  }
}
