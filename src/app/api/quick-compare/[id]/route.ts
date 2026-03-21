import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/quick-compare/[id] - Get a quick comparison by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comparison = await prisma.quickComparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      return NextResponse.json(
        { success: false, error: "Comparison not found" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > comparison.expiresAt) {
      return NextResponse.json(
        { success: false, error: "This comparison has expired", expired: true },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      comparison: {
        id: comparison.id,
        beforeUrl: comparison.beforeUrl,
        afterUrl: comparison.afterUrl,
        beforeLabel: comparison.beforeLabel,
        afterLabel: comparison.afterLabel,
        expiresAt: comparison.expiresAt.toISOString(),
        createdAt: comparison.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching quick comparison:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quick comparison" },
      { status: 500 }
    );
  }
}

// DELETE /api/quick-compare/[id] - Delete a quick comparison
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comparison = await prisma.quickComparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      return NextResponse.json(
        { success: false, error: "Comparison not found" },
        { status: 404 }
      );
    }

    await prisma.quickComparison.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Comparison deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quick comparison:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete quick comparison" },
      { status: 500 }
    );
  }
}
