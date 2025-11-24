import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { validateFrontmatter } from './schema';
import type { ComicFrontmatter } from '@/types/comic';

/**
 * Parses an MDX file and extracts frontmatter and content
 *
 * @param filePath - Absolute or relative path to the MDX file
 * @returns Object containing validated frontmatter and raw MDX content
 * @throws Error if file cannot be read or frontmatter is invalid
 *
 * Requirements: 5.1, 11.3, 11.4
 */
export async function parseMDXFile(filePath: string): Promise<{
  frontmatter: ComicFrontmatter;
  content: string;
}> {
  try {
    // Read the file content
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse frontmatter and content using gray-matter
    const { data, content } = matter(fileContent);

    // Validate frontmatter using Zod schema
    let validatedFrontmatter: ComicFrontmatter;
    try {
      validatedFrontmatter = validateFrontmatter(data);
    } catch (validationError) {
      // Enhance error message with file path for better debugging
      const errorMessage =
        validationError instanceof Error && 'errors' in validationError
          ? (
              validationError.errors as Array<{
                path: string[];
                message: string;
              }>
            )
              .map((err) => `${err.path.join('.')}: ${err.message}`)
              .join(', ')
          : validationError instanceof Error
            ? validationError.message
            : 'Validation failed';

      throw new Error(`Invalid frontmatter in ${filePath}: ${errorMessage}`);
    }

    return {
      frontmatter: validatedFrontmatter,
      content: content.trim(),
    };
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (
      error instanceof Error &&
      error.message.includes('Invalid frontmatter')
    ) {
      throw error;
    }

    // Handle file reading errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Comic file not found: ${filePath}`);
      }

      if (error.code === 'EACCES') {
        throw new Error(`Permission denied reading file: ${filePath}`);
      }
    }

    // Generic error
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Error parsing MDX file ${filePath}: ${message}`);
  }
}

/**
 * Validates frontmatter data and provides descriptive error messages
 * This is a re-export from schema.ts for convenience and to maintain
 * the abstraction layer as specified in the design document.
 *
 * @param data - Unknown data to validate
 * @returns Validated frontmatter data
 * @throws Error with descriptive message indicating which fields are invalid
 *
 * Requirements: 11.3, 11.4
 */
export { validateFrontmatter } from './schema';

/**
 * Reads all MDX files from a directory
 *
 * @param directoryPath - Path to directory containing MDX files
 * @returns Array of file paths for all .mdx files
 * @throws Error if directory cannot be read
 */
export async function getMDXFiles(directoryPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    const mdxFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
      .map((entry) => path.join(directoryPath, entry.name));

    return mdxFiles;
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      throw new Error(`Directory not found: ${directoryPath}`);
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Error reading directory ${directoryPath}: ${message}`);
  }
}

/**
 * Extracts the slug from an MDX filename
 * Follows the naming convention: YYYY-MM-slug.mdx
 *
 * @param filename - The MDX filename (with or without path)
 * @returns The extracted slug
 *
 * @example
 * extractSlugFromFilename('2024-01-mumo-meets-world.mdx') // returns 'mumo-meets-world'
 */
export function extractSlugFromFilename(filename: string): string {
  const basename = path.basename(filename, '.mdx');

  // Remove date prefix if present (YYYY-MM- pattern)
  const withoutDate = basename.replace(/^\d{4}-\d{2}-/, '');

  return withoutDate;
}
