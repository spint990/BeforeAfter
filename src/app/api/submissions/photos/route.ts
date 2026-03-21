import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paginationSchema } from "@/lib/validations";
import { logError } from "@/lib/error-utils";
import { z } from "zod";

// Status enum for validation
const submissionStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

// Custom parameter schema
const customParameterSchema = z.object({
  name: z.string().min(1, "Parameter name is required").max(100, "Parameter name is too long"),
  options: z.array(z.string().min(1)).min(1, "At least one option is required"),
  selectedOption: z.string().min(1, "Selected option is required"),
});

// Photo submission validation schema - supports both existing and custom parameters
const createPhotoSubmissionSchema = z.object({
  gameId: z.string().min(1, "Game ID is required"),
  imageUrl: z.string().url("Image URL must be a valid URL"),
  description: z.string().max(1000, "Description is too long").optional(),
  submittedBy: z.string().max(255, "Submitter name is too long").optional(),
  // Either existing parameter or custom parameter
  parameterId: z.string().optional(),
  qualityLevelId: z.string().optional(),
  customParameter: customParameterSchema.optional(),
}).refine(
  (data) => (data.parameterId && data.qualityLevelId) || data.customParameter,
  {
    message: "Either existing parameter/qualityLevel or customParameter must be provided",
  }
);

// GET /api/submissions/photos - List all photo submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { skip, take } = paginationSchema.parse({
      skip: searchParams.get("skip"),
      take: searchParams.get("take"),
    });

    const statusFilter = searchParams.get("status");
    const gameIdFilter = searchParams.get("gameId");
    const where: Record<string, unknown> = {};

    if (statusFilter) {
      const status = submissionStatusSchema.safeParse(statusFilter.toUpperCase());
      if (status.success) {
        where.status = status.data;
      }
    }

    if (gameIdFilter) {
      where.gameId = gameIdFilter;
    }

    const [submissions, total] = await Promise.all([
      prisma.photoSubmission.findMany({
        skip,
        take,
        where,
        include: {
          game: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          parameter: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          qualityLevel: {
            select: {
              id: true,
              level: true,
            },
          },
          photo: {
            select: {
              id: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.photoSubmission.count({ where }),
    ]);

    // Transform submissions to include parsed custom parameter data
    const transformedSubmissions = submissions.map((submission) => {
      if (submission.customParameterName) {
        return {
          ...submission,
          customParameter: {
            name: submission.customParameterName,
            options: submission.customParameterOptions 
              ? JSON.parse(submission.customParameterOptions) 
              : [],
            selectedOption: submission.customParameterSelected,
          },
        };
      }
      return submission;
    });

    return NextResponse.json({
      submissions: transformedSubmissions,
      total,
      pagination: {
        skip,
        take,
        total,
        hasMore: skip + take < total,
      },
    });
  } catch (error) {
    logError("Error fetching photo submissions:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch photo submissions" }, { status: 500 });
  }
}

// POST /api/submissions/photos - Create a new photo submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPhotoSubmissionSchema.parse(body);

    // Validate game exists
    const game = await prisma.game.findUnique({
      where: { id: validatedData.gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Handle custom parameter vs existing parameter
    if (validatedData.customParameter) {
      // Custom parameter submission - store in dedicated fields
      const { customParameter } = validatedData;
      
      const submission = await prisma.photoSubmission.create({
        data: {
          gameId: validatedData.gameId,
          imageUrl: validatedData.imageUrl,
          description: validatedData.description || null,
          submittedBy: validatedData.submittedBy || null,
          status: "PENDING",
          // Custom parameter fields
          customParameterName: customParameter.name,
          customParameterOptions: JSON.stringify(customParameter.options),
          customParameterSelected: customParameter.selectedOption,
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

      // Add custom parameter info to response
      return NextResponse.json({
        ...submission,
        customParameter: {
          name: customParameter.name,
          options: customParameter.options,
          selectedOption: customParameter.selectedOption,
        },
      }, { status: 201 });
    } else {
      // Existing parameter submission
      if (!validatedData.parameterId || !validatedData.qualityLevelId) {
        return NextResponse.json(
          { error: "Parameter ID and Quality Level ID are required for existing parameters" },
          { status: 400 }
        );
      }

      // Validate parameter exists and belongs to the game
      const parameter = await prisma.parameter.findUnique({
        where: { id: validatedData.parameterId },
      });

      if (!parameter) {
        return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
      }

      if (parameter.gameId !== validatedData.gameId) {
        return NextResponse.json(
          { error: "Parameter does not belong to the specified game" },
          { status: 400 }
        );
      }

      // Validate quality level exists and belongs to the parameter
      const qualityLevel = await prisma.qualityLevel.findUnique({
        where: { id: validatedData.qualityLevelId },
      });

      if (!qualityLevel) {
        return NextResponse.json({ error: "Quality level not found" }, { status: 404 });
      }

      if (qualityLevel.parameterId !== validatedData.parameterId) {
        return NextResponse.json(
          { error: "Quality level does not belong to the specified parameter" },
          { status: 400 }
        );
      }

      const submission = await prisma.photoSubmission.create({
        data: {
          gameId: validatedData.gameId,
          parameterId: validatedData.parameterId,
          qualityLevelId: validatedData.qualityLevelId,
          imageUrl: validatedData.imageUrl,
          description: validatedData.description || null,
          submittedBy: validatedData.submittedBy || null,
          status: "PENDING",
        },
        include: {
          game: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          parameter: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          qualityLevel: {
            select: {
              id: true,
              level: true,
            },
          },
        },
      });

      return NextResponse.json(submission, { status: 201 });
    }
  } catch (error) {
    logError("Error creating photo submission:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create photo submission" }, { status: 500 });
  }
}
