-- Migration to remove unused columns from the database
-- Run this SQL in your Neon dashboard SQL editor

-- Remove unused columns from game_submissions
ALTER TABLE "game_submissions" DROP COLUMN IF EXISTS "description";
ALTER TABLE "game_submissions" DROP COLUMN IF EXISTS "developer";
ALTER TABLE "game_submissions" DROP COLUMN IF EXISTS "publisher";
ALTER TABLE "game_submissions" DROP COLUMN IF EXISTS "submittedBy";
ALTER TABLE "game_submissions" DROP COLUMN IF EXISTS "reviewedBy";

-- Remove unused columns from photo_submissions
ALTER TABLE "photo_submissions" DROP COLUMN IF EXISTS "description";
ALTER TABLE "photo_submissions" DROP COLUMN IF EXISTS "submittedBy";
ALTER TABLE "photo_submissions" DROP COLUMN IF EXISTS "reviewedBy";

-- Remove unused columns from photos
ALTER TABLE "photos" DROP COLUMN IF EXISTS "description";
