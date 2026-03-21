import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paginationSchema } from "@/lib/validations";
import { z } from "zod";

// Status enum for validation
const submissionStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

// Game submission validation schema
const createGameSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(2000, "Description is too long").optional(),
  developer: z.string().max(255, "Developer name is too long").optional(),
  publisher: z.string().max(255, "Publisher name is too long").optional(),
  releaseYear: z.number().int().min(1970).max(new Date().getFullYear() + 5).optional(),
  coverImageUrl: z.string().url("Cover image must be a valid URL").optional().or(z.literal("")),
  submittedBy: z.string().max(255, "Submitter name is too long").optional(),
});

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/submissions/games - List all game submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { skip, take } = paginationSchema.parse({
      skip: searchParams.get("skip"),
      take: searchParams.get("take"),
    });
    
    const statusFilter = searchParams.get("status");
    const where: Record<string, unknown> = {};
    
    if (statusFilter) {
      const status = submissionStatusSchema.safeParse(statusFilter.toUpperCase());
      if (status.success) {
        where.status = status.data;
      }
    }

    const [submissions, total] = await Promise.all([
      prisma.gameSubmission.findMany({
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
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.gameSubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      total,
      pagination: {
        skip,
        take,
        total,
        hasMore: skip + take < total,
      },
    });
  } catch (error) {
    console.error("Error fetching game submissions:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch game submissions" }, { status: 500 });
  }
}

// POST /api/submissions/games - Create a new game submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createGameSubmissionSchema.parse(body);

    // Generate slug from name if not provided
    const slug = validatedData.slug || generateSlug(validatedData.name);

    // Check if slug already exists in games
    const existingGame = await prisma.game.findUnique({
      where: { slug },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "A game with this slug already exists" },
        { status: 400 }
      );
    }

    // Check if slug already exists in submissions
    const existingSubmission = await prisma.gameSubmission.findUnique({
      where: { slug },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "A submission with this slug already exists" },
        { status: 400 }
      );
    }

    const submission = await prisma.gameSubmission.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description || null,
        developer: validatedData.developer || null,
        publisher: validatedData.publisher || null,
        releaseYear: validatedData.releaseYear || null,
        coverImageUrl: validatedData.coverImageUrl || null,
        submittedBy: validatedData.submittedBy || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating game submission:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create game submission" }, { status: 500 });
  }
}
