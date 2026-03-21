-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parameters" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quality_levels" (
    "id" TEXT NOT NULL,
    "parameterId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "parameterId" TEXT NOT NULL,
    "qualityLevelId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submissionId" TEXT,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "developer" TEXT,
    "publisher" TEXT,
    "releaseYear" INTEGER,
    "coverImageUrl" TEXT,
    "submittedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "rejectionReason" TEXT,
    "gameId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_submissions" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "parameterId" TEXT,
    "qualityLevelId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "submittedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "rejectionReason" TEXT,
    "photoId" TEXT,
    "customParameterName" TEXT,
    "customParameterOptions" TEXT,
    "customParameterSelected" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photo_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quick_comparisons" (
    "id" TEXT NOT NULL,
    "beforeUrl" TEXT NOT NULL,
    "afterUrl" TEXT NOT NULL,
    "beforeLabel" TEXT NOT NULL DEFAULT 'Avant',
    "afterLabel" TEXT NOT NULL DEFAULT 'Après',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quick_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "parameters_gameId_slug_key" ON "parameters"("gameId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "quality_levels_parameterId_level_key" ON "quality_levels"("parameterId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "game_submissions_slug_key" ON "game_submissions"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "photo_submissions_photoId_key" ON "photo_submissions"("photoId");

-- AddForeignKey
ALTER TABLE "parameters" ADD CONSTRAINT "parameters_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quality_levels" ADD CONSTRAINT "quality_levels_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "parameters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "parameters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_qualityLevelId_fkey" FOREIGN KEY ("qualityLevelId") REFERENCES "quality_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "photo_submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_submissions" ADD CONSTRAINT "game_submissions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_submissions" ADD CONSTRAINT "photo_submissions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_submissions" ADD CONSTRAINT "photo_submissions_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "parameters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_submissions" ADD CONSTRAINT "photo_submissions_qualityLevelId_fkey" FOREIGN KEY ("qualityLevelId") REFERENCES "quality_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_submissions" ADD CONSTRAINT "photo_submissions_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
