# Design Document: User Submission System & Quick Comparison Feature

## Table of Contents
1. [Overview](#overview)
2. [Feature 1: User Submission System](#feature-1-user-submission-system)
3. [Feature 2: Quick Comparison Feature](#feature-2-quick-comparison-feature)
4. [Implementation Notes](#implementation-notes)

---

## Overview

This document outlines the design for two new features to extend the existing Video Game Graphics Comparison application:

1. **User Submission System**: Enable visitors to contribute games and photos, subject to admin approval
2. **Quick Comparison Feature**: Allow users to upload two images for instant comparison without database persistence

Both features integrate with the existing architecture, leveraging the current [`ImageComparisonSlider`](src/components/comparison/ImageComparisonSlider.tsx) component and admin infrastructure.

---

## Feature 1: User Submission System

### 1.1 Database Schema Changes

#### New Prisma Models

Add the following models to [`prisma/schema.prisma`](prisma/schema.prisma):

```prisma
// Submission status enum (simulated in SQLite as string)
// Values: PENDING, APPROVED, REJECTED

model GameSubmission {
  id          String   @id @default(cuid())
  name        String
  slug        String
  coverImage  String?
  status      String   @default("PENDING") // PENDING, APPROVED, REJECTED
  submittedBy String?  // Optional: IP or user identifier
  submittedAt DateTime @default(now())
  reviewedAt  DateTime?
  reviewedBy  String?  // Admin user ID (future: add admin system)
  rejectReason String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // If approved, link to the created game
  gameId      String?
  game        Game?    @relation(fields: [gameId], references: [id])
  
  photos PhotoSubmission[]
  
  @@unique([slug])
  @@map("game_submissions")
}

model PhotoSubmission {
  id              String   @id @default(cuid())
  
  // Either link to existing game OR game submission
  existingGameId  String?
  existingGame    Game?    @relation(fields: [existingGameId], references: [id])
  gameSubmissionId String?
  gameSubmission  GameSubmission? @relation(fields: [gameSubmissionId], references: [id])
  
  // Parameter info for the photo
  parameterName   String   // e.g., "Shadows", "Ray Tracing"
  parameterSlug   String
  
  // Quality level info
  level           String   // "Low", "Medium", "High", "Ultra"
  imageUrl        String
  
  // Submission metadata
  status          String   @default("PENDING")
  submittedBy     String?
  submittedAt     DateTime @default(now())
  reviewedAt      DateTime?
  reviewedBy      String?
  rejectReason    String?
  
  // If approved, link to created parameter and quality level
  parameterId     String?
  qualityLevelId  String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("photo_submissions")
}

// Update existing Game model to add relations
model Game {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  coverImage  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  parameters      Parameter[]
  photoSubmissions PhotoSubmission[] // New relation
  gameSubmissions GameSubmission[]  // New relation
  
  @@map("games")
}
```

#### Entity Relationship Diagram

```
┌───────────────────────┐       ┌───────────────────────┐
│   GameSubmission      │       │   PhotoSubmission     │
├───────────────────────┤       ├───────────────────────┤
│ id (PK)               │       │ id (PK)               │
│ name                  │       │ existingGameId (FK)   │───┐
│ slug                  │       │ gameSubmissionId (FK) │───┼──┐
│ coverImage            │       │ parameterName         │   │  │
│ status                │       │ parameterSlug         │   │  │
│ submittedBy           │       │ level                 │   │  │
│ submittedAt           │       │ imageUrl              │   │  │
│ reviewedAt            │       │ status                │   │  │
│ reviewedBy            │       │ submittedBy           │   │  │
│ rejectReason          │       │ submittedAt           │   │  │
│ gameId (FK)           │──┐    │ reviewedAt            │   │  │
└───────────────────────┘  │    │ reviewedBy            │   │  │
         ▲                 │    │ rejectReason          │   │  │
         │                 │    │ parameterId (FK)      │   │  │
         └─────────────────┼──── │ qualityLevelId (FK)   │   │  │
                           │    └───────────────────────┘   │  │
                           │              ▲                 │  │
                           │              └─────────────────┘  │
                           │                                 │
┌───────────────────────┐  │    ┌───────────────────────┐    │
│       Game            │  │    │      Parameter        │    │
├───────────────────────┤  │    ├───────────────────────┤    │
│ id (PK)               │◄─┼────│ id (PK)               │◄───┘
│ name                  │  │    │ gameId (FK)           │
│ slug                  │  │    │ name                  │
│ coverImage            │  │    │ slug                  │
└───────────────────────┘  │    └───────────────────────┘
         ▲                 │              │
         │                 │              │
         └─────────────────┼──────────────┘
                           │
                    Existing Relations
```

### 1.2 New API Routes

#### Game Submissions API

**`GET /api/submissions/games`**
List game submissions (admin only in production, open for transparency in dev).

```typescript
// Query Parameters
interface GetGameSubmissionsQuery {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  page?: number;
  limit?: number;
}

// Response
interface GameSubmissionsResponse {
  data: GameSubmission[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

**`POST /api/submissions/games`**
Submit a new game for approval.

```typescript
// Request Body
interface CreateGameSubmissionRequest {
  name: string;           // Required, min 2 chars
  slug: string;           // Required, auto-generated if empty
  coverImage?: string;    // Optional URL
  submittedBy?: string;   // Optional identifier
}

// Response: 201 Created
interface GameSubmissionResponse {
  id: string;
  name: string;
  slug: string;
  status: string;
  submittedAt: string;
  message: string;
}
```

**`GET /api/submissions/games/[id]`**
Get a single game submission.

**`PUT /api/submissions/games/[id]`**
Update a game submission (only PENDING status, for corrections).

**`DELETE /api/submissions/games/[id]`**
Delete a game submission (creator or admin only).

**`POST /api/submissions/games/[id]/approve`**
Approve a game submission (admin only).

```typescript
// Response: 200 OK
interface ApproveGameSubmissionResponse {
  success: true;
  game: Game;  // The newly created game
  submission: GameSubmission;  // Updated with gameId and status
}
```

**`POST /api/submissions/games/[id]/reject`**
Reject a game submission (admin only).

```typescript
// Request Body
interface RejectGameSubmissionRequest {
  reason: string;  // Required rejection reason
}

// Response: 200 OK
interface RejectGameSubmissionResponse {
  success: true;
  submission: GameSubmission;
}
```

#### Photo Submissions API

**`GET /api/submissions/photos`**
List photo submissions.

```typescript
// Query Parameters
interface GetPhotoSubmissionsQuery {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  gameId?: string;        // Filter by existing game
  page?: number;
  limit?: number;
}

// Response
interface PhotoSubmissionsResponse {
  data: PhotoSubmission[];
  meta: { total, page, limit, totalPages };
}
```

**`POST /api/submissions/photos`**
Submit photos for an existing game.

```typescript
// Request Body
interface CreatePhotoSubmissionRequest {
  existingGameId: string;     // Required: game to add photos to
  parameterName: string;      // e.g., "Ray Tracing"
  parameterSlug: string;      // Auto-generated if empty
  level: string;              // "Low", "Medium", "High", "Ultra"
  imageUrl: string;           // Required
  submittedBy?: string;
}

// Response: 201 Created
```

**`POST /api/submissions/photos/batch`**
Submit multiple photos at once.

```typescript
// Request Body
interface BatchPhotoSubmissionRequest {
  existingGameId: string;
  photos: Array<{
    parameterName: string;
    parameterSlug: string;
    level: string;
    imageUrl: string;
  }>;
  submittedBy?: string;
}
```

**`POST /api/submissions/photos/[id]/approve`**
Approve a photo submission (admin only).

**`POST /api/submissions/photos/[id]/reject`**
Reject a photo submission (admin only).

### 1.3 New Page Components

#### Public Submission Pages

**`/submit` - Main Submission Hub**
```
src/app/submit/page.tsx
```

Component structure:
- Header with submission guidelines
- Two options:
  1. Submit a New Game (leads to game submission form)
  2. Submit Photos for Existing Game (leads to photo submission form)

**`/submit/game` - Game Submission Form**
```
src/app/submit/game/page.tsx
```

Component structure:
- Game name input
- Slug auto-generation from name
- Cover image upload (using existing [`ImageUploader`](src/components/admin/ImageUploader.tsx))
- Optional contributor identifier
- Submit button
- Success/pending state feedback

**`/submit/photos` - Photo Submission Form**
```
src/app/submit/photos/page.tsx
```

Component structure:
- Game selector dropdown (loads from existing games)
- Parameter creator/adder:
  - Select existing parameter OR create new
  - Upload photos for each quality level
- Batch upload support
- Preview before submission
- Submit button

#### Admin Review Pages

**`/admin/submissions` - Submissions Dashboard**
```
src/app/admin/submissions/page.tsx
```

Component structure:
- Summary stats (pending games, pending photos)
- Tabs for Games vs Photos
- Filter by status
- List of submissions with quick actions

**`/admin/submissions/games/[id]` - Review Game Submission**
```
src/app/admin/submissions/games/[id]/page.tsx
```

Component structure:
- Full submission details
- Preview of cover image
- Approve/Reject buttons with reason input
- If approved: show link to created game

**`/admin/submissions/photos/[id]` - Review Photo Submission**
```
src/app/admin/submissions/photos/[id]/page.tsx
```

Component structure:
- Game context (which game)
- Parameter and level info
- Image preview with comparison slider (if comparing against existing)
- Approve/Reject buttons

### 1.4 New Component Structure

```
src/components/
├── submissions/
│   ├── GameSubmissionForm.tsx      # Public game submission form
│   ├── PhotoSubmissionForm.tsx     # Public photo submission form
│   ├── GameSelector.tsx            # Dropdown to select existing game
│   ├── ParameterCreator.tsx        # Create/select parameter for submission
│   ├── BatchPhotoUploader.tsx      # Upload multiple photos at once
│   └── SubmissionGuidelines.tsx    # Guidelines and rules display
│
├── admin/
│   ├── SubmissionsDashboard.tsx    # Admin overview
│   ├── GameSubmissionCard.tsx      # Card for game submission in list
│   ├── PhotoSubmissionCard.tsx     # Card for photo submission in list
│   ├── ReviewGameSubmission.tsx    # Detailed review view
│   ├── ReviewPhotoSubmission.tsx   # Detailed review with comparison
│   └── ApprovalActions.tsx         # Approve/Reject buttons with reason
│
└── ui/
    ├── Badge.tsx                   # Status badge (pending, approved, rejected)
    └── Tabs.tsx                    # Tab component for submissions dashboard
```

### 1.5 TypeScript Types

Add to [`src/types/index.ts`](src/types/index.ts):

```typescript
// ==========================================
// Submission Types
// ==========================================

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface GameSubmission {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  status: SubmissionStatus;
  submittedBy: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  rejectReason: string | null;
  gameId: string | null;
  game?: Game | null;
  photos?: PhotoSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotoSubmission {
  id: string;
  existingGameId: string | null;
  existingGame?: Game | null;
  gameSubmissionId: string | null;
  gameSubmission?: GameSubmission | null;
  parameterName: string;
  parameterSlug: string;
  level: string;
  imageUrl: string;
  status: SubmissionStatus;
  submittedBy: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
  rejectReason: string | null;
  parameterId: string | null;
  qualityLevelId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Form Data Types
export interface GameSubmissionFormData {
  name: string;
  slug?: string;
  coverImage?: string;
  submittedBy?: string;
}

export interface PhotoSubmissionFormData {
  existingGameId: string;
  parameterName: string;
  parameterSlug?: string;
  level: string;
  imageUrl: string;
  submittedBy?: string;
}

export interface BatchPhotoSubmissionFormData {
  existingGameId: string;
  photos: Array<{
    parameterName: string;
    parameterSlug: string;
    level: string;
    imageUrl: string;
  }>;
  submittedBy?: string;
}

// API Response Types
export interface SubmissionStats {
  pendingGames: number;
  pendingPhotos: number;
  approvedToday: number;
  rejectedToday: number;
}
```

### 1.6 User Flow Diagrams

#### Game Submission Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GAME SUBMISSION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Visitor                 Submission Form              API                  Admin
   │                          │                       │                     │
   │ 1. Click "Submit Game"   │                       │                     │
   ├─────────────────────────>│                       │                     │
   │                          │                       │                     │
   │ 2. Fill form:            │                       │                     │
   │    - Game name           │                       │                     │
   │    - Upload cover        │                       │                     │
   │    - Optional ID         │                       │                     │
   ├─────────────────────────>│                       │                     │
   │                          │                       │                     │
   │                          │ 3. Validate data      │                     │
   │                          ├──────────────────────>│                     │
   │                          │                       │                     │
   │                          │                       │ 4. Create submission│
   │                          │                       │    status: PENDING  │
   │                          │                       │                     │
   │                          │ 5. Success response   │                     │
   │<──────────────────────────┤                       │                     │
   │                          │                       │                     │
   │ 6. Show confirmation     │                       │                     │
   │    "Submitted for review"│                       │                     │
   │                          │                       │                     │
   │                          │                       │     7. Admin views  │
   │                          │                       │        submissions  │
   │                          │                       │<────────────────────┤
   │                          │                       │                     │
   │                          │                       │ 8. Review and decide│
   │                          │                       │<────────────────────┤
   │                          │                       │                     │
   │                          │                       │    ┌────────────────┤
   │                          │                       │    │ DECISION       │
   │                          │                       │    ├────────────────┤
   │                          │                       │    │ A: Approve     │
   │                          │                       │    │    - Create    │
   │                          │                       │    │      Game      │
   │                          │                       │    │    - Update    │
   │                          │                       │    │      status    │
   │                          │                       │    ├────────────────┤
   │                          │                       │    │ B: Reject      │
   │                          │                       │    │    - Add       │
   │                          │                       │    │      reason    │
   │                          │                       │    │    - Update    │
   │                          │                       │    │      status    │
   │                          │                       │    └────────────────┤
   │                          │                       │                     │
   │ 9. Optional: Visitor     │                       │                     │
   │    checks status         │                       │                     │
   ├─────────────────────────>│                       │                     │
   │                          │ GET submission        │                     │
   │                          ├──────────────────────>│                     │
   │                          │ Return status         │                     │
   │<──────────────────────────┤                       │                     │
   │                          │                       │                     │
```

#### Photo Submission Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHOTO SUBMISSION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

Visitor                 Photo Form                   API                  Admin
   │                          │                       │                     │
   │ 1. Select existing game  │                       │                     │
   ├─────────────────────────>│ Load game list        │                     │
   │                          ├──────────────────────>│                     │
   │                          │<──────────────────────┤                     │
   │                          │                       │                     │
   │ 2. Select/create param   │                       │                     │
   ├─────────────────────────>│                       │                     │
   │    - Choose existing OR  │                       │                     │
   │    - Enter new name      │                       │                     │
   │                          │                       │                     │
   │ 3. Upload photos         │                       │                     │
   ├─────────────────────────>│ Upload to /api/upload │                     │
   │                          ├──────────────────────>│                     │
   │                          │<────── Image URLs ────┤                     │
   │                          │                       │                     │
   │ 4. Select quality level  │                       │                     │
   │    for each photo        │                       │                     │
   ├─────────────────────────>│                       │                     │
   │                          │                       │                     │
   │ 5. Submit batch          │                       │                     │
   ├─────────────────────────>│ Create submissions    │                     │
   │                          ├──────────────────────>│                     │
   │                          │<────── Success ───────┤                     │
   │                          │                       │                     │
   │                          │                       │ 6. Admin reviews    │
   │                          │                       │<────────────────────┤
   │                          │                       │                     │
   │                          │                       │ 7. If approved:     │
   │                          │                       │    - Create/find    │
   │                          │                       │      parameter      │
   │                          │                       │    - Create quality │
   │                          │                       │      level          │
   │                          │                       │                     │
```

### 1.7 Approval Workflow Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      APPROVAL WORKFLOW - GAME                                │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │ PENDING Game    │
                    │   Submission    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Admin Review  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐           ┌────────▼────────┐
     │    APPROVE      │           │    REJECT       │
     └────────┬────────┘           └────────┬────────┘
              │                             │
     ┌────────▼────────┐           ┌────────▼────────┐
     │ 1. Check slug   │           │ 1. Require      │
     │    uniqueness   │           │    reason       │
     │ 2. Create Game  │           │ 2. Update       │
     │    record       │           │    status       │
     │ 3. Link Game    │           │ 3. Store reason │
     │    to submission│           │ 4. Notify       │
     │ 4. Update       │           │    (optional)   │
     │    status       │           └─────────────────┘
     │ 5. Process any  │
     │    pending      │
     │    photos       │
     └─────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                      APPROVAL WORKFLOW - PHOTO                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │ PENDING Photo   │
                    │   Submission    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Admin Review  │
                    │   - View image  │
                    │   - Compare to  │
                    │     existing    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
     ┌────────▼────────┐           ┌────────▼────────┐
     │    APPROVE      │           │    REJECT       │
     └────────┬────────┘           └────────┬────────┘
              │                             │
     ┌────────▼────────┐           ┌────────▼────────┐
     │ 1. Find or      │           │ 1. Require      │
     │    create       │           │    reason       │
     │    Parameter    │           │ 2. Update       │
     │ 2. Create       │           │    status       │
     │    QualityLevel │           │ 3. Store reason │
     │ 3. Link both    │           └─────────────────┘
     │    to submission│
     │ 4. Update       │
     │    status       │
     └─────────────────┘
```

---

## Feature 2: Quick Comparison Feature

### 2.1 Overview

A standalone page where users can upload two images and instantly see them in the comparison slider. No database persistence required - purely client-side with URL sharing capability.

### 2.2 Technical Approach

#### Option A: Base64 URL Parameters (Simplest)
- Convert images to base64
- Encode in URL query parameters
- Limited by URL length (~2KB-8KB depending on browser)
- Not practical for full-resolution images

#### Option B: Blob URLs + Session Storage (Recommended)
- Store images in browser session storage
- Generate unique session ID
- Share session ID via URL
- Requires server-side session for true sharing

#### Option C: Temporary File Storage (Best for Sharing)
- Upload images to temporary storage
- Generate unique comparison ID
- Store reference in database with TTL
- Files auto-deleted after 24 hours

**Recommended: Option C** for best sharing experience, with Option B as fallback.

### 2.3 Database Schema

Add a simple model for temporary comparisons:

```prisma
model QuickComparison {
  id          String   @id @default(cuid())
  leftImage   String   // URL to left/before image
  rightImage  String   // URL to right/after image
  leftLabel   String   @default("Before")
  rightLabel  String   @default("After")
  createdAt   DateTime @default(now())
  expiresAt   DateTime // TTL: 24 hours from creation
  
  @@index([expiresAt])
  @@map("quick_comparisons")
}
```

### 2.4 API Routes

**`POST /api/quick-compare`**
Create a new quick comparison.

```typescript
// Request Body
interface CreateQuickComparisonRequest {
  leftImage: string;      // Base64 or URL
  rightImage: string;     // Base64 or URL
  leftLabel?: string;
  rightLabel?: string;
}

// Response
interface QuickComparisonResponse {
  id: string;
  shareUrl: string;       // /compare/quick/[id]
  expiresAt: string;
}
```

**`GET /api/quick-compare/[id]`**
Retrieve a quick comparison.

```typescript
// Response
interface QuickComparisonData {
  id: string;
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
  expiresAt: string;
}
```

**`POST /api/quick-compare/upload`**
Upload temporary image for quick comparison.

```typescript
// Request: multipart/form-data
// - file: Image file

// Response
interface TempImageResponse {
  tempUrl: string;        // Temporary URL valid for 24h
  expiresAt: string;
}
```

### 2.5 Page Components

**`/compare/quick` - Quick Comparison Page**
```
src/app/compare/quick/page.tsx
```

Component structure:
- Two image upload areas (drag & drop or click)
- Optional label inputs
- Preview thumbnails
- "Compare" button to launch comparison
- Loading states during upload

**`/compare/quick/[id]` - Shared Comparison View**
```
src/app/compare/quick/[id]/page.tsx
```

Component structure:
- Fetch comparison data by ID
- Render [`ImageComparisonSlider`](src/components/comparison/ImageComparisonSlider.tsx)
- "Create your own comparison" link
- Expiration notice
- Share buttons (copy URL, social)

### 2.6 New Components

```
src/components/
├── quick-compare/
│   ├── QuickCompareUploader.tsx    # Dual image upload interface
│   ├── QuickCompareView.tsx        # Wrapper for slider with share
│   ├── ImageDropZone.tsx           # Drag and drop upload component
│   └── ShareButtons.tsx            # Social sharing buttons
```

### 2.7 Component Interfaces

```typescript
// QuickCompareUploader.tsx
interface QuickCompareUploaderProps {
  onCompare: (data: QuickCompareData) => void;
  maxFileSize?: number;        // Default: 10MB
  acceptedFormats?: string[];  // Default: ['image/jpeg', 'image/png', 'image/webp']
}

interface QuickCompareData {
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
}

// ImageDropZone.tsx
interface ImageDropZoneProps {
  onImageSelect: (file: File, preview: string) => void;
  currentImage?: string;
  label: string;
  className?: string;
}

// QuickCompareView.tsx
interface QuickCompareViewProps {
  comparisonId: string;
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
  expiresAt: Date;
}

// ShareButtons.tsx
interface ShareButtonsProps {
  url: string;
  title: string;
}
```

### 2.8 User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUICK COMPARISON FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

User                    Quick Compare               API                 Storage
   │                          │                       │                     │
   │ 1. Visit /compare/quick  │                       │                     │
   ├─────────────────────────>│                       │                     │
   │                          │                       │                     │
   │ 2. Upload left image     │                       │                     │
   ├─────────────────────────>│ Upload to temp        │                     │
   │                          ├──────────────────────>│ Save to temp dir    │
   │                          │<────── Temp URL ──────┤<────────────────────┤
   │                          │                       │                     │
   │ 3. Upload right image    │                       │                     │
   ├─────────────────────────>│ Upload to temp        │                     │
   │                          ├──────────────────────>│ Save to temp dir    │
   │                          │<────── Temp URL ──────┤<────────────────────┤
   │                          │                       │                     │
   │ 4. Optional: Edit labels │                       │                     │
   ├─────────────────────────>│                       │                     │
   │                          │                       │                     │
   │ 5. Click "Compare"       │                       │                     │
   ├─────────────────────────>│ Create comparison     │                     │
   │                          ├──────────────────────>│ Store in DB         │
   │                          │<────── ID + URL ──────┤<────────────────────┤
   │                          │                       │                     │
   │ 6. Redirect to view      │                       │                     │
   │<─────────────────────────┤                       │                     │
   │                          │                       │                     │
   │                          │                       │                     │
   │ [SHARING FLOW]           │                       │                     │
   │                          │                       │                     │
   │ 7. Copy share URL        │                       │                     │
   ├─────────────────────────>│                       │                     │
   │                          │                       │                     │
   │                          │                       │                     │
   │ [RECIPIENT FLOW]         │                       │                     │
   │                          │                       │                     │
   │ 8. Recipient opens URL   │                       │                     │
   ├─────────────────────────>│ Load comparison       │                     │
   │                          ├──────────────────────>│ Fetch from DB       │
   │                          │<────── Image URLs ────┤<────────────────────┤
   │                          │                       │                     │
   │ 9. View comparison       │                       │                     │
   │<─────────────────────────┤                       │                     │
   │    - Use slider          │                       │                     │
   │    - Share again         │                       │                     │
   │    - Create own          │                       │                     │
   │                          │                       │                     │
   │                          │                       │                     │
   │ [CLEANUP - AUTOMATIC]    │                       │                     │
   │                          │                       │                     │
   │                          │                       │ 10. After 24h:      │
   │                          │                       │     - Delete temp   │
   │                          │                       │       files         │
   │                          │                       │     - Delete DB     │
   │                          │                       │       records       │
   │                          │                       │<────────────────────┤
   │                          │                       │                     │
```

### 2.9 Storage Considerations

#### Temporary File Storage

```
public/
└── temp/
    └── quick-compare/
        ├── abc123-left.jpg
        ├── abc123-right.jpg
        └── ...
```

#### Cleanup Strategy

1. **Database TTL**: Use `expiresAt` field with index
2. **Cron Job**: Run cleanup every hour
3. **API Route**: `/api/cleanup/temp` called by cron or scheduled task

```typescript
// Cleanup API route pseudocode
// GET /api/cleanup/temp?key=CRON_SECRET

async function cleanupExpiredComparisons() {
  const now = new Date();
  
  // Find expired comparisons
  const expired = await prisma.quickComparison.findMany({
    where: { expiresAt: { lt: now } }
  });
  
  // Delete files
  for (const comp of expired) {
    await deleteFile(comp.leftImage);
    await deleteFile(comp.rightImage);
  }
  
  // Delete DB records
  await prisma.quickComparison.deleteMany({
    where: { expiresAt: { lt: now } }
  });
}
```

---

## Implementation Notes

### Phase 1: User Submission System Foundation

1. **Database Migration**
   - Add `GameSubmission` and `PhotoSubmission` models
   - Run migration: `npx prisma migrate dev --name add_submissions`
   - Update Prisma client

2. **Core API Routes**
   - Implement `POST /api/submissions/games`
   - Implement `POST /api/submissions/photos`
   - Implement `GET /api/submissions/games` (list)
   - Implement `GET /api/submissions/photos` (list)

3. **Public Submission Pages**
   - Create `/submit` hub page
   - Create `/submit/game` form
   - Create `/submit/photos` form

### Phase 2: Admin Approval Workflow

1. **Admin API Routes**
   - Implement approve/reject endpoints
   - Add validation and error handling

2. **Admin Review Pages**
   - Create `/admin/submissions` dashboard
   - Create individual review pages
   - Add approval actions component

3. **Approval Logic**
   - Implement game creation on approval
   - Implement parameter/quality level creation on photo approval
   - Handle edge cases (slug conflicts, etc.)

### Phase 3: Quick Comparison Feature

1. **Database & Storage**
   - Add `QuickComparison` model
   - Set up temporary file storage
   - Implement cleanup mechanism

2. **API Routes**
   - Implement upload and create routes
   - Implement retrieval route

3. **Page Components**
   - Create uploader page
   - Create view/share page
   - Integrate with existing slider component

### Phase 4: Polish & Testing

1. **UI/UX Improvements**
   - Add loading states
   - Add error handling
   - Add success notifications
   - Mobile responsiveness

2. **Validation & Security**
   - Input validation on all forms
   - Rate limiting on submissions
   - File type/size validation
   - XSS prevention

3. **Testing**
   - Unit tests for API routes
   - Integration tests for submission flow
   - E2E tests for critical paths

### Security Considerations

1. **Rate Limiting**
   - Limit submissions per IP: 5 per hour
   - Limit quick comparisons per IP: 20 per hour

2. **File Validation**
   - Validate MIME types server-side
   - Strip EXIF data from uploads
   - Maximum file size: 10MB for comparisons, 5MB for submissions

3. **Input Sanitization**
   - Sanitize all text inputs
   - Validate slug format
   - Prevent SQL injection via Prisma parameterization

4. **Admin-Only Actions**
   - All approve/reject endpoints require admin auth
   - Future: Add authentication system

### Future Enhancements

1. **User Accounts**
   - Allow users to track their submissions
   - Notification system for approval/rejection

2. **Moderation Queue**
   - Email notifications for new submissions
   - Bulk approval actions

3. **Quick Comparison Enhancements**
   - Annotation tools
   - Download comparison as animated GIF
   - Custom slider themes

4. **Analytics**
   - Track submission conversion rates
   - Track quick comparison shares

---

## File Structure Summary

### New Files to Create

```
prisma/
└── migrations/
    └── [timestamp]_add_submissions/
        └── migration.sql

src/
├── app/
│   ├── submit/
│   │   ├── page.tsx                    # Submission hub
│   │   ├── game/
│   │   │   └── page.tsx                # Game submission form
│   │   └── photos/
│   │       └── page.tsx                # Photo submission form
│   │
│   ├── admin/
│   │   └── submissions/
│   │       ├── page.tsx                # Submissions dashboard
│   │       ├── games/
│   │       │   └── [id]/
│   │       │       └── page.tsx        # Review game submission
│   │       └── photos/
│   │           └── [id]/
│   │               └── page.tsx        # Review photo submission
│   │
│   ├── compare/
│   │   └── quick/
│   │       ├── page.tsx                # Quick compare uploader
│   │       └── [id]/
│   │           └── page.tsx            # Shared comparison view
│   │
│   └── api/
│       ├── submissions/
│       │   ├── games/
│       │   │   ├── route.ts            # GET list, POST create
│       │   │   └── [id]/
│       │   │       ├── route.ts        # GET, PUT, DELETE
│       │   │       ├── approve/
│       │   │       │   └── route.ts    # POST approve
│       │   │       └── reject/
│       │   │           └── route.ts    # POST reject
│       │   └── photos/
│       │       ├── route.ts            # GET list, POST create
│       │       ├── batch/
│       │       │   └── route.ts        # POST batch create
│       │       └── [id]/
│       │           ├── route.ts        # GET, DELETE
│       │           ├── approve/
│       │           │   └── route.ts    # POST approve
│       │           └── reject/
│       │               └── route.ts    # POST reject
│       │
│       ├── quick-compare/
│       │   ├── route.ts                # POST create
│       │   ├── upload/
│       │   │   └── route.ts            # POST upload temp image
│       │   └── [id]/
│       │       └── route.ts            # GET comparison
│       │
│       └── cleanup/
│           └── temp/
│               └── route.ts            # GET cleanup expired
│
├── components/
│   ├── submissions/
│   │   ├── GameSubmissionForm.tsx
│   │   ├── PhotoSubmissionForm.tsx
│   │   ├── GameSelector.tsx
│   │   ├── ParameterCreator.tsx
│   │   ├── BatchPhotoUploader.tsx
│   │   └── SubmissionGuidelines.tsx
│   │
│   ├── admin/
│   │   ├── SubmissionsDashboard.tsx
│   │   ├── GameSubmissionCard.tsx
│   │   ├── PhotoSubmissionCard.tsx
│   │   ├── ReviewGameSubmission.tsx
│   │   ├── ReviewPhotoSubmission.tsx
│   │   └── ApprovalActions.tsx
│   │
│   ├── quick-compare/
│   │   ├── QuickCompareUploader.tsx
│   │   ├── QuickCompareView.tsx
│   │   ├── ImageDropZone.tsx
│   │   └── ShareButtons.tsx
│   │
│   └── ui/
│       ├── Badge.tsx
│       └── Tabs.tsx
│
└── lib/
    ├── validations.ts                  # Add submission validation schemas
    └── rate-limit.ts                   # Rate limiting utility
```

### Files to Modify

1. [`prisma/schema.prisma`](prisma/schema.prisma) - Add new models
2. [`src/types/index.ts`](src/types/index.ts) - Add new types
3. [`src/lib/validations.ts`](src/lib/validations.ts) - Add validation schemas

---

## Summary

This design document outlines two new features for the Video Game Graphics Comparison application:

1. **User Submission System**: A complete workflow for community contributions, including database schema, API routes, pages, and admin review interface.

2. **Quick Comparison Feature**: A lightweight image comparison tool with sharing capability, using temporary storage and automatic cleanup.

Both features integrate seamlessly with the existing architecture, reusing components like [`ImageComparisonSlider`](src/components/comparison/ImageComparisonSlider.tsx) and [`ImageUploader`](src/components/admin/ImageUploader.tsx), while adding new capabilities to extend the application's functionality.
