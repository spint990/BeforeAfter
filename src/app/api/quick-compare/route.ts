import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/error-utils";

// POST /api/quick-compare - Create a new quick comparison
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { beforeUrl, afterUrl, beforeLabel, afterLabel } = body;

    // Validate required fields
    if (!beforeUrl || !afterUrl) {
      return NextResponse.json(
        { success: false, error: "Both beforeUrl and afterUrl are required" },
        { status: 400 }
      );
    }

    // Validate URLs are strings
    if (typeof beforeUrl !== "string" || typeof afterUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create the quick comparison
    const comparison = await prisma.quickComparison.create({
      data: {
        beforeUrl,
        afterUrl,
        beforeLabel: beforeLabel || "Avant",
        afterLabel: afterLabel || "Après",
        expiresAt,
      },
    });

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
    logError("Error creating quick comparison:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create quick comparison" },
      { status: 500 }
    );
  }
}
