import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/error-utils";
import { unlink } from "fs/promises";
import { join } from "path";

// POST /api/admin/cleanup-rejected - Delete all rejected submissions
export async function POST() {
  try {
    // Get all rejected photo submissions to delete their image files
    const rejectedPhotoSubmissions = await prisma.photoSubmission.findMany({
      where: { status: "REJECTED" },
      select: { id: true, imageUrl: true },
    });

    // Delete image files for rejected photo submissions
    let deletedImages = 0;
    for (const submission of rejectedPhotoSubmissions) {
      if (submission.imageUrl) {
        try {
          const imagePath = join(process.cwd(), "public", submission.imageUrl);
          await unlink(imagePath);
          deletedImages++;
        } catch (fileError) {
          // Log error but continue with other files
          logError(`Warning: Could not delete image file ${submission.imageUrl}:`, fileError);
        }
      }
    }

    // Delete all rejected photo submissions
    const deletedPhotos = await prisma.photoSubmission.deleteMany({
      where: { status: "REJECTED" },
    });

    // Delete all rejected game submissions
    const deletedGames = await prisma.gameSubmission.deleteMany({
      where: { status: "REJECTED" },
    });

    return NextResponse.json({
      message: "Cleanup completed successfully",
      deletedPhotoSubmissions: deletedPhotos.count,
      deletedGameSubmissions: deletedGames.count,
      deletedImageFiles: deletedImages,
    });
  } catch (error) {
    logError("Error cleaning up rejected submissions:", error);
    return NextResponse.json(
      { error: "Failed to cleanup rejected submissions" },
      { status: 500 }
    );
  }
}

// GET /api/admin/cleanup-rejected - Get count of rejected submissions
export async function GET() {
  try {
    const rejectedPhotos = await prisma.photoSubmission.count({
      where: { status: "REJECTED" },
    });

    const rejectedGames = await prisma.gameSubmission.count({
      where: { status: "REJECTED" },
    });

    return NextResponse.json({
      rejectedPhotoSubmissions: rejectedPhotos,
      rejectedGameSubmissions: rejectedGames,
      total: rejectedPhotos + rejectedGames,
    });
  } catch (error) {
    logError("Error counting rejected submissions:", error);
    return NextResponse.json(
      { error: "Failed to count rejected submissions" },
      { status: 500 }
    );
  }
}
