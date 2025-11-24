import { z } from 'zod';

/**
 * Zod schema for validating comic frontmatter
 * Ensures all required fields are present and properly formatted
 */
export const ComicFrontmatterSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase alphanumeric with hyphens only'
    ),

  publishDate: z
    .string()
    .datetime({ message: 'Publish date must be a valid ISO 8601 datetime' }),

  synopsis: z
    .string()
    .min(10, 'Synopsis must be at least 10 characters')
    .max(300, 'Synopsis must be 300 characters or less'),

  tags: z
    .array(
      z
        .string()
        .min(2, 'Each tag must be at least 2 characters')
        .max(20, 'Each tag must be 20 characters or less')
    )
    .min(1, 'At least one tag is required')
    .max(5, 'Maximum of 5 tags allowed'),

  readingTime: z
    .number()
    .int('Reading time must be an integer')
    .positive('Reading time must be a positive number'),

  coverImage: z
    .string()
    .min(1, 'Cover image is required')
    .startsWith('/comics/', 'Cover image path must start with /comics/'),

  author: z
    .string()
    .min(1, 'Author name must be at least 1 character')
    .max(50, 'Author name must be 50 characters or less')
    .optional(),

  featured: z.boolean().optional(),
});

/**
 * Type inference from the Zod schema
 * This ensures TypeScript types stay in sync with validation rules
 */
export type ComicFrontmatterValidated = z.infer<typeof ComicFrontmatterSchema>;

/**
 * Validates comic frontmatter data against the schema
 * @param data - Unknown data to validate
 * @returns Validated and typed frontmatter data
 * @throws ZodError with detailed validation errors if data is invalid
 */
export function validateFrontmatter(data: unknown): ComicFrontmatterValidated {
  return ComicFrontmatterSchema.parse(data);
}

/**
 * Safely validates comic frontmatter data without throwing
 * @param data - Unknown data to validate
 * @returns Success object with data or error object with issues
 */
export function safeParseFrontmatter(data: unknown) {
  return ComicFrontmatterSchema.safeParse(data);
}
