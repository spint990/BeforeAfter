import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateQualityLevelSchema } from "@/lib/validations";
import { z } from "zod";
import { logError } from "@/lib/error-utils";
import { Prisma } from "@prisma/client";

// GET /api/quality-levels/[id] - Get a single quality level
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const qualityLevel = await prisma.qualityLevel.findUnique({
      where: { id },
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
    });

    if (!qualityLevel) {
      return NextResponse.json({ error: "Quality level not found" }, { status: 404 });
    }

    return NextResponse.json(qualityLevel);
  } catch (error) {
    logError("Error fetching quality level:", error);
    return NextResponse.json({ error: "Failed to fetch quality level" }, { status: 500 });
  }
}

// PUT /api/quality-levels/[id] - Update a quality level
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateQualityLevelSchema.parse(body);

    // Check if quality level exists
    const existingLevel = await prisma.qualityLevel.findUnique({
      where: { id },
    });

    if (!existingLevel) {
      return NextResponse.json({ error: "Quality level not found" }, { status: 404 });
    }

    // Determine target parameterId for uniqueness check
    const targetParameterId = validatedData.parameterId || existingLevel.parameterId;
    const targetLevel = validatedData.level || existingLevel.level;

    // Check for level conflicts if level or parameterId is being changed
    if (
      (validatedData.level && validatedData.level !== existingLevel.level) ||
      (validatedData.parameterId && validatedData.parameterId !== existingLevel.parameterId)
    ) {
      const levelConflict = await prisma.qualityLevel.findFirst({
        where: {
          parameterId: targetParameterId,
          level: targetLevel,
          NOT: { id },
        },
      });
      if (levelConflict) {
        return NextResponse.json(
          { error: "A quality level with this level already exists for this parameter" },
          { status: 400 }
        );
      }
    }

    // If parameterId is being changed, verify the new parameter exists
    if (validatedData.parameterId && validatedData.parameterId !== existingLevel.parameterId) {
      const parameter = await prisma.parameter.findUnique({
        where: { id: validatedData.parameterId },
      });
      if (!parameter) {
        return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
      }
    }

    // Build update data object with proper typing
    const updateData: Prisma.QualityLevelUncheckedUpdateInput = {};
    if (validatedData.level !== undefined) {
      updateData.level = validatedData.level;
    }
    if (validatedData.imageUrl !== undefined) {
      updateData.imageUrl = validatedData.imageUrl;
    }
    if (validatedData.parameterId !== undefined) {
      updateData.parameterId = validatedData.parameterId;
    }

    const qualityLevel = await prisma.qualityLevel.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(qualityLevel);
  } catch (error) {
    logError("Error updating quality level:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to update quality level" }, { status: 500 });
  }
}

// DELETE /api/quality-levels/[id] - Delete a quality level
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if quality level exists
    const existingLevel = await prisma.qualityLevel.findUnique({
      where: { id },
    });

    if (!existingLevel) {
      return NextResponse.json({ error: "Quality level not found" }, { status: 404 });
    }

    // Delete the quality level
    await prisma.qualityLevel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("Error deleting quality level:", error);
    return NextResponse.json({ error: "Failed to delete quality level" }, { status: 500 });
  }
}
