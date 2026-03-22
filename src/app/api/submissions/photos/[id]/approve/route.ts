import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/error-utils";

// Helper to generate a URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// POST /api/submissions/photos/[id]/approve - Approve a photo submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if submission exists and is PENDING
    const submission = await prisma.photoSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "Photo submission not found" }, { status: 404 });
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only approve submissions with PENDING status" },
        { status: 400 }
      );
    }

    // Check if this is a custom parameter submission (no parameterId/qualityLevelId)
    const isCustomParameter = submission.customParameterName && !submission.parameterId;

    // Verify that the game exists
    const game = await prisma.game.findUnique({ where: { id: submission.gameId } });
    if (!game) {
      return NextResponse.json({ error: "Associated game not found" }, { status: 404 });
    }

    if (isCustomParameter) {
      // For custom parameter submissions, create the Parameter, QualityLevel, and Photo
      const customParameterName = submission.customParameterName!;
      let customOptions: string[] = [];
      
      try {
        customOptions = submission.customParameterOptions 
          ? JSON.parse(submission.customParameterOptions) 
          : [];
      } catch (e) {
        logError("Failed to parse customParameterOptions:", e);
        return NextResponse.json(
          { error: "Invalid custom parameter options format" },
          { status: 400 }
        );
      }

      const selectedOption = submission.customParameterSelected;

      if (!customOptions || customOptions.length === 0) {
        return NextResponse.json(
          { error: "Custom parameter has no options" },
          { status: 400 }
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await prisma.$transaction(async (tx: any) => {
        // Check if parameter already exists for this game
        const parameterSlug = generateSlug(customParameterName);
        let parameter = await tx.parameter.findFirst({
          where: {
            gameId: submission.gameId,
            slug: parameterSlug,
          },
        });

        // Create parameter if it doesn't exist
        if (!parameter) {
          parameter = await tx.parameter.create({
            data: {
              gameId: submission.gameId,
              name: customParameterName,
              slug: parameterSlug,
            },
          });
        }

        // Find or create the quality level for the selected option
        let qualityLevel = await tx.qualityLevel.findFirst({
          where: {
            parameterId: parameter.id,
            level: selectedOption || customOptions[0],
          },
        });

        if (!qualityLevel) {
          // Create the quality level with the submission's image
          qualityLevel = await tx.qualityLevel.create({
            data: {
              parameterId: parameter.id,
              level: selectedOption || customOptions[0],
              imageUrl: submission.imageUrl,
            },
          });
        }

        // Create the Photo
        const photo = await tx.photo.create({
          data: {
            gameId: submission.gameId,
            parameterId: parameter.id,
            qualityLevelId: qualityLevel.id,
            imageUrl: submission.imageUrl,
            description: submission.description,
          },
        });

        // Delete the submission after successful creation
        await tx.photoSubmission.delete({
          where: { id },
        });

        return { photo, parameter, qualityLevel };
      });

      return NextResponse.json({
        message: "Custom parameter photo submission approved",
        photo: result.photo,
        parameter: result.parameter,
        qualityLevel: result.qualityLevel,
      });
    }

    // Standard submission - verify parameter and quality level exist
    if (!submission.parameterId || !submission.qualityLevelId) {
      return NextResponse.json(
        { error: "Missing parameterId or qualityLevelId for standard submission" },
        { status: 400 }
      );
    }

    const [parameter, qualityLevel] = await Promise.all([
      prisma.parameter.findUnique({ where: { id: submission.parameterId } }),
      prisma.qualityLevel.findUnique({ where: { id: submission.qualityLevelId } }),
    ]);

    if (!parameter) {
      return NextResponse.json({ error: "Associated parameter not found" }, { status: 404 });
    }
    if (!qualityLevel) {
      return NextResponse.json({ error: "Associated quality level not found" }, { status: 404 });
    }

    // Create the photo and delete submission in a transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Create new Photo from submission data
      const photo = await tx.photo.create({
        data: {
          gameId: submission.gameId,
          parameterId: submission.parameterId!,
          qualityLevelId: submission.qualityLevelId!,
          imageUrl: submission.imageUrl,
          description: submission.description,
        },
      });

      // Delete the submission after approval to keep only published photos
      await tx.photoSubmission.delete({
        where: { id },
      });

      return { photo };
    });

    return NextResponse.json({
      message: "Photo submission approved",
      photo: result.photo,
    });
  } catch (error) {
    logError("Error approving photo submission:", error);
    return NextResponse.json({ error: "Failed to approve photo submission" }, { status: 500 });
  }
}
