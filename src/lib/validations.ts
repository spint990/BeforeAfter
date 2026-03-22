import { z } from "zod";

// Game validation schemas
export const createGameSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  coverImage: z.string().url("Cover image must be a valid URL").optional().or(z.literal("")),
});

export const updateGameSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  coverImage: z.string().url("Cover image must be a valid URL").optional().or(z.literal("")).nullable(),
});

// Parameter validation schemas
export const createParameterSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  gameId: z.string().min(1, "Game ID is required"),
});

export const updateParameterSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  gameId: z.string().min(1, "Game ID is required").optional(),
});

// Quality Level validation schemas
// Level can be any string (custom levels allowed), not just predefined enum values
export const createQualityLevelSchema = z.object({
  level: z.string().min(1, "Level name is required").max(100, "Level name is too long"),
  imageUrl: z.string().optional(), // Optional - can be empty string or URL
  parameterId: z.string().min(1, "Parameter ID is required"),
});

export const updateQualityLevelSchema = z.object({
  level: z.string().min(1, "Level name is required").max(100, "Level name is too long").optional(),
  imageUrl: z.string().optional(), // Optional - can be empty string or URL
  parameterId: z.string().min(1, "Parameter ID is required").optional(),
});

// Pagination query schema
// DEBUG: Log incoming values to diagnose ZodError
export const paginationSchema = z.object({
  skip: z.preprocess(
    (val) => {
      console.log('[DEBUG paginationSchema] skip input:', val, typeof val);
      return val === null ? undefined : val;
    },
    z.coerce.number().int().min(0).default(0)
  ),
  take: z.preprocess(
    (val) => {
      console.log('[DEBUG paginationSchema] take input:', val, typeof val);
      return val === null ? undefined : val;
    },
    z.coerce.number().int().min(1).max(100).default(20)
  ),
});

// Type exports for use in API routes
export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
export type CreateParameterInput = z.infer<typeof createParameterSchema>;
export type UpdateParameterInput = z.infer<typeof updateParameterSchema>;
export type CreateQualityLevelInput = z.infer<typeof createQualityLevelSchema>;
export type UpdateQualityLevelInput = z.infer<typeof updateQualityLevelSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
