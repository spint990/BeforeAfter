import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/error-utils";
import { revalidatePath, revalidateTag } from "next/cache";

// POST /api/submissions/games/[id]/approve - Approve a game submission
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if submission exists and is PENDING
    const submission = await prisma.gameSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "Game submission not found" }, { status: 404 });
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only approve submissions with PENDING status" },
        { status: 400 }
      );
    }

    // Check if game with this slug already exists
    const existingGame = await prisma.game.findUnique({
      where: { slug: submission.slug },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "A game with this slug already exists" },
        { status: 400 }
      );
    }

    // Create the game and delete submission in a transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Create new Game from submission data
      const game = await tx.game.create({
        data: {
          name: submission.name,
          slug: submission.slug,
          coverImage: submission.coverImageUrl,
        },
      });

      // Delete the submission after approval to keep only published games
      await tx.gameSubmission.delete({
        where: { id },
      });

      return { game };
    });

    // Revalidate the games pages to show the new game
    revalidatePath("/games");
    revalidatePath("/", "layout");
    revalidatePath("/admin/games");
    revalidateTag("games");

    return NextResponse.json({
      message: "Game submission approved and deleted",
      game: result.game,
    });
  } catch (error) {
    logError("Error approving game submission:", error);
    return NextResponse.json({ error: "Failed to approve game submission" }, { status: 500 });
  }
}
