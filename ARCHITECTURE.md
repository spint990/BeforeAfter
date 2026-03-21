# Video Game Graphics Comparison App - Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [Project Folder Structure](#project-folder-structure)
5. [API Route Specifications](#api-route-specifications)
6. [Component Architecture](#component-architecture)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [ImageComparisonSlider Implementation Notes](#imagecomparisonslider-implementation-notes)

---

## Overview

This application allows users to compare video game graphics quality settings side-by-side using an interactive slider interface. Users can view how different graphical parameters (shadows, textures, anti-aliasing, etc.) appear at various quality levels (Low, Medium, High, Ultra).

### Key Features
- Browse games and their graphical parameters
- Interactive before/after image comparison slider
- Admin interface for managing games, parameters, and quality levels
- Image upload functionality for quality level screenshots

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14+ | Full-stack React framework with App Router |
| TypeScript | 5.x | Type safety and developer experience |
| Tailwind CSS | 3.x | Utility-first CSS styling |
| Prisma | 5.x | ORM for database operations |
| SQLite | 3.x | Embedded database for development |
| React | 18.x | UI component library |

---

## Database Schema

### Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Game {
  id         String       @id @default(cuid())
  name       String       @unique
  slug       String       @unique
  coverImage String?
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  
  parameters Parameter[]
  
  @@map("games")
}

model Parameter {
  id           String        @id @default(cuid())
  gameId       String
  name         String
  slug         String
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  game         Game          @relation(fields: [gameId], references: [id], onDelete: Cascade)
  qualityLevels QualityLevel[]
  
  @@unique([gameId, slug])
  @@map("parameters")
}

model QualityLevel {
  id          String   @id @default(cuid())
  parameterId String
  level       String   // "Low", "Medium", "High", "Ultra"
  imageUrl    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  parameter   Parameter @relation(fields: [parameterId], references: [id], onDelete: Cascade)
  
  @@unique([parameterId, level])
  @@map("quality_levels")
}
```

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      Game       │       │    Parameter    │       │  QualityLevel   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │───┐   │ id (PK)         │
│ name            │   │   │ gameId (FK)     │   │   │ parameterId(FK) │
│ slug            │   └──>│ name            │   └──>│ level           │
│ coverImage      │       │ slug            │       │ imageUrl        │
│ createdAt       │       │ createdAt       │       │ createdAt       │
│ updatedAt       │       │ updatedAt       │       │ updatedAt       │
└─────────────────┘       └─────────────────┘       └─────────────────┘
        │                         │                         │
        │         1:N             │         1:N             │
        └─────────────────────────┴─────────────────────────┘
                   Cascading Deletes Enabled
```

---

## Project Folder Structure

```
beforeafter/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page - game list
│   ├── globals.css                   # Global styles
│   │
│   ├── games/
│   │   ├── page.tsx                  # Games listing page
│   │   └── [slug]/
│   │       ├── page.tsx              # Game detail page
│   │       └── compare/
│   │           └── page.tsx          # Comparison view
│   │
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── games/
│   │   │   ├── page.tsx              # Games management
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create new game
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Edit game
│   │   │       └── parameters/
│   │   │           └── page.tsx      # Manage parameters
│   │   └── upload/
│   │       └── page.tsx              # Bulk image upload
│   │
│   └── api/
│       ├── games/
│       │   ├── route.ts              # GET /api/games, POST /api/games
│       │   └── [id]/
│       │       └── route.ts          # GET, PUT, DELETE /api/games/:id
│       ├── parameters/
│       │   ├── route.ts              # GET, POST /api/parameters
│       │   └── [id]/
│       │       └── route.ts          # GET, PUT, DELETE /api/parameters/:id
│       ├── quality-levels/
│       │   ├── route.ts              # GET, POST /api/quality-levels
│       │   └── [id]/
│       │       └── route.ts          # GET, PUT, DELETE /api/quality-levels/:id
│       └── upload/
│           └── route.ts              # POST /api/upload - image upload
│
├── components/
│   ├── ui/                           # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   │
│   ├── comparison/
│   │   ├── ImageComparisonSlider.tsx # Core comparison slider
│   │   ├── ComparisonView.tsx        # Full comparison layout
│   │   └── ParameterSelector.tsx     # Parameter/level selection
│   │
│   ├── games/
│   │   ├── GameCard.tsx              # Game card for grid
│   │   ├── GameList.tsx              # Games grid container
│   │   └── GameDetail.tsx            # Game detail view
│   │
│   ├── admin/
│   │   ├── AdminGameForm.tsx         # Add/edit game form
│   │   ├── ParameterManager.tsx      # Manage game parameters
│   │   ├── QualityLevelEditor.tsx    # Edit quality levels
│   │   └── ImageUploader.tsx         # Image upload component
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Sidebar.tsx
│       └── Navigation.tsx
│
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   ├── utils.ts                      # Utility functions
│   ├── validations.ts                # Zod schemas for validation
│   └── storage.ts                    # File storage utilities
│
├── types/
│   ├── index.ts                      # Barrel export
│   ├── game.ts                       # Game types
│   ├── parameter.ts                  # Parameter types
│   ├── quality-level.ts              # QualityLevel types
│   └── api.ts                        # API response types
│
├── public/
│   ├── images/
│   │   ├── covers/                   # Game cover images
│   │   └── comparisons/              # Comparison screenshots
│   └── favicon.ico
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Seed data
│   └── migrations/                   # Migration files
│
├── .env                              # Environment variables
├── .env.example                      # Example env file
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## API Route Specifications

### Games API

#### `GET /api/games`
List all games with optional filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Cyberpunk 2077",
      "slug": "cyberpunk-2077",
      "coverImage": "/images/covers/cyberpunk.jpg",
      "parameters": [
        {
          "id": "clx...",
          "name": "Shadows",
          "slug": "shadows",
          "_count": { "qualityLevels": 4 }
        }
      ],
      "_count": { "parameters": 8 }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

#### `POST /api/games`
Create a new game.

**Request Body:**
```json
{
  "name": "Cyberpunk 2077",
  "slug": "cyberpunk-2077",
  "coverImage": "/images/covers/cyberpunk.jpg"
}
```

**Response:** `201 Created`
```json
{
  "id": "clx...",
  "name": "Cyberpunk 2077",
  "slug": "cyberpunk-2077",
  "coverImage": "/images/covers/cyberpunk.jpg",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### `GET /api/games/[id]`
Get a single game with all parameters and quality levels.

**Response:**
```json
{
  "id": "clx...",
  "name": "Cyberpunk 2077",
  "slug": "cyberpunk-2077",
  "coverImage": "/images/covers/cyberpunk.jpg",
  "parameters": [
    {
      "id": "clx...",
      "name": "Shadows",
      "slug": "shadows",
      "qualityLevels": [
        {
          "id": "clx...",
          "level": "Low",
          "imageUrl": "/images/comparisons/cyberpunk-shadows-low.jpg"
        },
        {
          "id": "clx...",
          "level": "High",
          "imageUrl": "/images/comparisons/cyberpunk-shadows-high.jpg"
        }
      ]
    }
  ]
}
```

#### `PUT /api/games/[id]`
Update a game.

**Request Body:**
```json
{
  "name": "Cyberpunk 2077: Phantom Liberty",
  "coverImage": "/images/covers/cyberpunk-updated.jpg"
}
```

#### `DELETE /api/games/[id]`
Delete a game and all related data (cascading).

**Response:** `204 No Content`

---

### Parameters API

#### `GET /api/parameters`
List parameters, optionally filtered by game.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `gameId` | string | Filter by game ID |

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "name": "Shadows",
      "slug": "shadows",
      "gameId": "clx...",
      "qualityLevels": [
        { "id": "clx...", "level": "Low", "imageUrl": "..." },
        { "id": "clx...", "level": "Medium", "imageUrl": "..." },
        { "id": "clx...", "level": "High", "imageUrl": "..." },
        { "id": "clx...", "level": "Ultra", "imageUrl": "..." }
      ]
    }
  ]
}
```

#### `POST /api/parameters`
Create a new parameter.

**Request Body:**
```json
{
  "gameId": "clx...",
  "name": "Ray Tracing",
  "slug": "ray-tracing"
}
```

#### `PUT /api/parameters/[id]`
Update a parameter.

**Request Body:**
```json
{
  "name": "Ray Tracing Reflections",
  "slug": "ray-tracing-reflections"
}
```

#### `DELETE /api/parameters/[id]`
Delete a parameter and its quality levels (cascading).

---

### Quality Levels API

#### `GET /api/quality-levels`
List quality levels, optionally filtered by parameter.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `parameterId` | string | Filter by parameter ID |

#### `POST /api/quality-levels`
Create a new quality level.

**Request Body:**
```json
{
  "parameterId": "clx...",
  "level": "Ultra",
  "imageUrl": "/images/comparisons/game-param-ultra.jpg"
}
```

#### `PUT /api/quality-levels/[id]`
Update a quality level.

**Request Body:**
```json
{
  "level": "Ultra+",
  "imageUrl": "/images/comparisons/game-param-ultra-plus.jpg"
}
```

#### `DELETE /api/quality-levels/[id]`
Delete a quality level.

---

### Upload API

#### `POST /api/upload`
Upload an image file.

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | Image file (jpg, png, webp) |
| `type` | string | "cover" or "comparison" |

**Response:**
```json
{
  "success": true,
  "url": "/images/comparisons/abc123.jpg",
  "filename": "abc123.jpg"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid file type. Allowed: jpg, png, webp"
}
```

---

## Component Architecture

### Component Hierarchy

```
App Layout (RootLayout)
├── Header
│   ├── Logo
│   ├── Navigation
│   └── AdminLink
├── Main Content
│   ├── Home Page
│   │   └── GameList
│   │       └── GameCard (multiple)
│   │
│   ├── Game Detail Page
│   │   ├── GameDetail
│   │   │   ├── GameHeader
│   │   │   └── ParameterList
│   │   │       └── ParameterCard (multiple)
│   │   └── ComparisonView
│   │       ├── ParameterSelector
│   │       └── ImageComparisonSlider
│   │
│   └── Admin Pages
│       ├── AdminGameForm
│       │   ├── FormFields
│       │   └── ImageUploader
│       └── ParameterManager
│           ├── ParameterList
│           └── QualityLevelEditor
│               └── ImageUploader
└── Footer
```

---

### Component Interfaces

#### ImageComparisonSlider

```typescript
interface ImageComparisonSliderProps {
  beforeImage: string;           // URL of before/low quality image
  afterImage: string;            // URL of after/high quality image
  beforeLabel?: string;          // Label for before side (default: "Before")
  afterLabel?: string;           // Label for after side (default: "After")
  initialPosition?: number;      // Slider starting position 0-100 (default: 50)
  orientation?: 'horizontal' | 'vertical';  // Slider direction
  className?: string;            // Additional CSS classes
}
```

#### GameCard

```typescript
interface GameCardProps {
  game: {
    id: string;
    name: string;
    slug: string;
    coverImage: string | null;
    parameters: Array<{
      id: string;
      name: string;
    }>;
  };
  onClick?: (id: string) => void;
  showParameterCount?: boolean;  // Show parameter count badge
  className?: string;
}
```

#### AdminGameForm

```typescript
interface AdminGameFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    name: string;
    slug: string;
    coverImage: string | null;
  };
  onSubmit: (data: GameFormData) => Promise<void>;
  onCancel?: () => void;
}

interface GameFormData {
  name: string;
  slug: string;
  coverImage?: string | null;
}
```

#### ParameterManager

```typescript
interface ParameterManagerProps {
  gameId: string;
  parameters: Array<{
    id: string;
    name: string;
    slug: string;
    qualityLevels: Array<{
      id: string;
      level: string;
      imageUrl: string;
    }>;
  }>;
  onParameterAdd: (data: ParameterFormData) => Promise<void>;
  onParameterUpdate: (id: string, data: ParameterFormData) => Promise<void>;
  onParameterDelete: (id: string) => Promise<void>;
  onQualityLevelUpdate: (parameterId: string, levelId: string, imageUrl: string) => Promise<void>;
}

interface ParameterFormData {
  name: string;
  slug: string;
}
```

#### ImageUploader

```typescript
interface ImageUploaderProps {
  onUpload: (url: string) => void;
  accept?: string;               // Accepted file types (default: "image/*")
  maxSize?: number;              // Max file size in MB (default: 5)
  preview?: boolean;             // Show image preview
  currentImage?: string;         // Current image URL for editing
  className?: string;
}
```

#### ComparisonView

```typescript
interface ComparisonViewProps {
  game: {
    id: string;
    name: string;
    parameters: Array<{
      id: string;
      name: string;
      slug: string;
      qualityLevels: Array<{
        id: string;
        level: string;
        imageUrl: string;
      }>;
    }>;
  };
  defaultParameterId?: string;   // Initially selected parameter
  defaultBeforeLevel?: string;   // Initially selected before level
  defaultAfterLevel?: string;    // Initially selected after level
}
```

#### ParameterSelector

```typescript
interface ParameterSelectorProps {
  parameters: Array<{
    id: string;
    name: string;
    qualityLevels: Array<{
      id: string;
      level: string;
      imageUrl: string;
    }>;
  }>;
  selectedParameterId: string;
  selectedBeforeLevel: string;
  selectedAfterLevel: string;
  onParameterChange: (id: string) => void;
  onBeforeLevelChange: (level: string) => void;
  onAfterLevelChange: (level: string) => void;
}
```

---

## Data Flow Diagrams

### User Browsing Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐
│  User   │     │  Home Page  │     │  API Route  │     │ Database │
└────┬────┘     └──────┬──────┘     └──────┬──────┘     └────┬─────┘
     │                 │                   │                 │
     │ Visit /         │                   │                 │
     ├────────────────>│                   │                 │
     │                 │ GET /api/games    │                 │
     │                 ├──────────────────>│                 │
     │                 │                   │ Find many games │
     │                 │                   ├────────────────>│
     │                 │                   │     Games[]     │
     │                 │                   │<────────────────┤
     │                 │   Games response  │                 │
     │                 │<──────────────────┤                 │
     │   GameList UI   │                   │                 │
     │<────────────────┤                   │                 │
     │                 │                   │                 │
     │ Click game      │                   │                 │
     ├────────────────>│                   │                 │
     │                 │ GET /api/games/id │                 │
     │                 ├──────────────────>│                 │
     │                 │                   │ Find game with  │
     │                 │                   │ parameters      │
     │                 │                   ├────────────────>│
     │                 │                   │  Game + params  │
     │                 │                   │<────────────────┤
     │                 │  Game detail data │                 │
     │                 │<──────────────────┤                 │
     │   Game Detail   │                   │                 │
     │<────────────────┤                   │                 │
```

### Comparison View Data Flow

```
┌─────────┐  ┌──────────────────┐  ┌───────────────────┐  ┌────────────────┐
│  User   │  │ ComparisonView   │  │ ParameterSelector │  │ImageComparison │
└────┬────┘  └────────┬─────────┘  └─────────┬─────────┘  │    Slider      │
     │                │                      │            └───────┬────────┘
     │                │                      │                    │
     │ Select param   │                      │                    │
     ├───────────────>│                      │                    │
     │                │ Update state         │                    │
     │                ├─────────────────────>│                    │
     │                │                      │                    │
     │ Select levels  │                      │                    │
     ├───────────────>│                      │                    │
     │                │ Pass image URLs      │                    │
     │                ├──────────────────────────────────────────>│
     │                │                      │                    │
     │ Drag slider    │                      │                    │
     ├──────────────────────────────────────────────────────────>│
     │                │                      │     Update clip    │
     │                │                      │     position       │
     │   Visual feedback                     │                    │
     │<──────────────────────────────────────────────────────────┤
```

### Admin Data Flow

```
┌─────────┐  ┌───────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│  Admin  │  │ AdminGameForm │  │ API Routes │  │ Prisma   │  │ Database │
└────┬────┘  └───────┬───────┘  └──────┬─────┘  └────┬─────┘  └────┬─────┘
     │               │                 │             │             │
     │ Submit form   │                 │             │             │
     ├──────────────>│                 │             │             │
     │               │ Validate data   │             │             │
     │               ├────────────────>│             │             │
     │               │                 │ Create game │             │
     │               │                 ├────────────>│             │
     │               │                 │             │ INSERT      │
     │               │                 │             ├────────────>│
     │               │                 │             │   Success   │
     │               │                 │             │<────────────┤
     │               │                 │   Result    │             │
     │               │                 │<────────────┤             │
     │               │  New game data  │             │             │
     │               │<────────────────┤             │             │
     │   Success/ID  │                 │             │             │
     │<──────────────┤                 │             │             │
```

### Image Upload Flow

```
┌─────────┐  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐
│  User   │  │ImageUploader │  │ Upload API  │  │ File System   │
└────┬────┘  └──────┬───────┘  └──────┬──────┘  └───────┬───────┘
     │              │                 │                 │
     │ Select file  │                 │                 │
     ├─────────────>│                 │                 │
     │              │ Validate type   │                 │
     │              │ and size        │                 │
     │              ├────────────────>│                 │
     │              │                 │ Generate unique │
     │              │                 │ filename        │
     │              │                 ├────────────────>│
     │              │                 │ Write to /public│
     │              │                 ├────────────────>│
     │              │                 │   File saved    │
     │              │                 │<────────────────┤
     │              │  { url: path }  │                 │
     │              │<────────────────┤                 │
     │  Preview URL │                 │                 │
     │<─────────────┤                 │                 │
```

---

## ImageComparisonSlider Implementation Notes

### Core Functionality

The `ImageComparisonSlider` is the signature component of this application. It allows users to drag a slider handle to reveal different portions of two overlapping images.

### Technical Approach

#### 1. DOM Structure

```html
<div class="comparison-container">
  <!-- After image (bottom layer, full width) -->
  <img src="after.jpg" class="after-image" />
  
  <!-- Before image (top layer, clipped) -->
  <div class="before-image-wrapper" style="clip-path: inset(0 50% 0 0)">
    <img src="before.jpg" class="before-image" />
  </div>
  
  <!-- Slider handle -->
  <div class="slider-handle" style="left: 50%">
    <div class="slider-line"></div>
    <div class="slider-grip">
      <span>◀</span>
      <span>▶</span>
    </div>
  </div>
  
  <!-- Labels -->
  <div class="label-before">Low</div>
  <div class="label-after">High</div>
</div>
```

#### 2. CSS Approach (using Tailwind)

```css
.comparison-container {
  @apply relative overflow-hidden rounded-lg;
  aspect-ratio: 16/9; /* or configurable */
}

.after-image,
.before-image {
  @apply absolute inset-0 w-full h-full object-cover;
}

.before-image-wrapper {
  @apply absolute inset-0 overflow-hidden;
  /* clip-path updated via JS */
}

.slider-handle {
  @apply absolute top-0 bottom-0 w-1 cursor-ew-resize;
  @apply transform -translate-x-1/2;
  /* left position updated via JS */
}

.slider-line {
  @apply absolute inset-y-0 left-1/2 w-0.5 bg-white shadow-lg;
}

.slider-grip {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  @apply w-10 h-10 rounded-full bg-white shadow-lg;
  @apply flex items-center justify-center gap-1;
}
```

#### 3. Event Handling Strategy

```typescript
// Use pointer events for unified mouse/touch handling
const handlePointerDown = (e: React.PointerEvent) => {
  setIsDragging(true);
  updatePosition(e.clientX);
};

const handlePointerMove = (e: React.PointerEvent) => {
  if (!isDragging) return;
  updatePosition(e.clientX);
};

const handlePointerUp = () => {
  setIsDragging(false);
};

const updatePosition = (clientX: number) => {
  const rect = containerRef.current?.getBoundingClientRect();
  if (!rect) return;
  
  // Calculate position as percentage
  const x = clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  setSliderPosition(percentage);
};
```

#### 4. Key Implementation Details

1. **Image Preloading**: Both images should be preloaded to prevent layout shifts during interaction.

2. **Clip Path vs Width**: Use `clip-path: inset()` instead of width manipulation for smoother performance and proper image positioning.

3. **Touch Support**: Use pointer events (`onPointerDown`, `onPointerMove`, `onPointerUp`) for unified mouse/touch handling.

4. **Keyboard Accessibility**: Support arrow keys for slider movement (Left/Right arrows move slider by 5%).

5. **ARIA Labels**: Include proper ARIA attributes for screen readers:
   ```html
   <div role="slider" 
        aria-valuemin="0" 
        aria-valuemax="100" 
        aria-valuenow="50"
        aria-label="Image comparison slider">
   ```

6. **Responsive Images**: Consider using `srcset` for different screen sizes, especially for mobile.

7. **Performance**: Use `requestAnimationFrame` for smooth updates during drag:
   ```typescript
   const updatePosition = (clientX: number) => {
     requestAnimationFrame(() => {
       // Update position logic
     });
   };
   ```

8. **Vertical Orientation Support**: For vertical sliders, swap x/y calculations and use `clip-path: inset(0 0 X% 0)`.

#### 5. Animation Considerations

- Add smooth transitions for initial position on mount
- Consider spring animations for handle movement (can use CSS or framer-motion)
- Add subtle hover effects on the slider grip

#### 6. Error Handling

- Handle image load errors gracefully with fallback UI
- Show loading state while images are being fetched
- Validate image URLs before rendering

---

## Implementation Phases

### Phase 1: Foundation
- Set up Next.js project with TypeScript and Tailwind
- Configure Prisma with SQLite
- Create database schema and run migrations
- Implement basic UI components (Button, Card, Input)

### Phase 2: Core Features
- Build Games API routes (CRUD)
- Create GameList and GameCard components
- Implement game detail page
- Build ImageComparisonSlider component

### Phase 3: Admin Interface
- Create admin layout and dashboard
- Build AdminGameForm with ImageUploader
- Implement ParameterManager
- Add quality level editing

### Phase 4: Polish & Optimization
- Add image upload functionality
- Implement search and filtering
- Add loading states and error handling
- Optimize images and performance
- Add SEO metadata

---

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR="./public/images"
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "prisma": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0"
  }
}
```
