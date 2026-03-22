import { NextRequest, NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { logError } from "@/lib/error-utils";

// Allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// POST /api/upload - Handle client-side upload via Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // This handles the client-side upload flow from @vercel/blob/client
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Validate the file type from the pathname
        const extension = pathname.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        
        if (!extension || !allowedExtensions.includes(extension)) {
          throw new Error('Invalid file type. Allowed: jpg, png, webp');
        }

        return {
          allowedContentTypes: ALLOWED_FILE_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          tokenPayload: JSON.stringify({
            // Add any additional metadata here
          }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    logError("Error handling upload:", error);
    
    // Return proper JSON error response
    const errorMessage = error instanceof Error ? error.message : "Failed to handle upload";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
