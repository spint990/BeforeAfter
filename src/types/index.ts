// ==========================================
// Database Model Types
// ==========================================

export interface Game {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  parameters?: Parameter[];
}

export interface Parameter {
  id: string;
  gameId: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  game?: Game;
  qualityLevels?: QualityLevel[];
}

export interface QualityLevel {
  id: string;
  parameterId: string;
  level: string; // "Low", "Medium", "High", "Ultra"
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  parameter?: Parameter;
}

// ==========================================
// Form Data Types
// ==========================================

export interface GameFormData {
  name: string;
  slug: string;
  coverImage?: string | null;
}

export interface ParameterFormData {
  name: string;
  slug: string;
}

export interface QualityLevelFormData {
  parameterId: string;
  level: string;
  imageUrl: string;
}

// ==========================================
// Component Prop Types
// ==========================================

export interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export interface GameCardProps {
  game: {
    id: string;
    name: string;
    slug: string;
    coverImage: string | null;
    parameters?: Array<{
      id: string;
      name: string;
    }>;
  };
  onClick?: (id: string) => void;
  showParameterCount?: boolean;
  className?: string;
}

export interface AdminGameFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    slug: string;
    coverImage: string | null;
  };
  onSubmit: (data: GameFormData) => Promise<void>;
  onCancel?: () => void;
}

export interface ParameterManagerProps {
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

export interface ImageUploaderProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
  preview?: boolean;
  currentImage?: string;
  className?: string;
}

export interface ComparisonViewProps {
  game: {
    id: string;
    name: string;
    slug: string;
    coverImage: string | null;
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
  defaultParameterId?: string;
  defaultBeforeLevel?: string;
  defaultAfterLevel?: string;
}

export interface ParameterSelectorProps {
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

// ==========================================
// API Response Types
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  error?: string;
}

// ==========================================
// Game with nested data (for API responses)
// ==========================================

export interface GameWithParameters extends Omit<Game, 'parameters'> {
  parameters: Array<{
    id: string;
    name: string;
    slug: string;
    qualityLevels: QualityLevel[];
    _count?: {
      qualityLevels: number;
    };
  }>;
  _count?: {
    parameters: number;
  };
}

export interface ParameterWithQualityLevels extends Omit<Parameter, 'qualityLevels'> {
  qualityLevels: QualityLevel[];
}
