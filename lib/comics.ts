import path from 'path';
import { cache } from 'react';
import { parseMDXFile, getMDXFiles, extractSlugFromFilename } from './mdx';
import type { Comic } from '@/types/comic';

/**
 * Directory containing comic MDX files
 */
const COMICS_DIRECTORY = path.join(process.cwd(), 'content', 'comics');

/**
 * Compares two comics by publish date (descending) with slug as tiebreaker
 * Used for consistent sorting across the application
 *
 * @param a - First comic to compare
 * @param b - Second comic to compare
 * @returns Negative if a is newer, positive if b is newer, 0 if equal
 */
function compareByDateAndSlug(a: Comic, b: Comic): number {
  const dateA = new Date(a.frontmatter.publishDate).getTime();
  const dateB = new Date(b.frontmatter.publishDate).getTime();

  // Sort by date descending (newest first)
  if (dateA !== dateB) {
    return dateB - dateA;
  }

  // If dates are equal, use slug as tiebreaker (alphabetical ascending)
  return a.slug.localeCompare(b.slug);
}

/**
 * Retrieves all published comics from the file system
 * Results are sorted by publish date (newest first) with slug as tiebreaker
 *
 * This function is cached using React's cache() to prevent redundant file reads
 * within the same request lifecycle
 *
 * @returns Array of all comics sorted by publish date descending
 * @throws Error if comics directory cannot be read or comics cannot be parsed
 *
 * Requirements: 1.3, 2.1, 11.1, 11.2
 */
export const getAllComics = cache(async (): Promise<Comic[]> => {
  try {
    // Get all MDX files from the comics directory
    const mdxFiles = await getMDXFiles(COMICS_DIRECTORY);

    // Parse each MDX file
    const comics: Comic[] = await Promise.all(
      mdxFiles.map(async (filePath) => {
        const { frontmatter, content } = await parseMDXFile(filePath);
        const slug = extractSlugFromFilename(filePath);

        return {
          frontmatter,
          content,
          slug,
        };
      })
    );

    // Sort by publish date (newest first) with slug as tiebreaker
    comics.sort(compareByDateAndSlug);

    return comics;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to retrieve comics: ${message}`);
  }
});

/**
 * Retrieves a specific comic by its slug
 *
 * This function is cached using React's cache() to prevent redundant file reads
 * within the same request lifecycle
 *
 * @param slug - The unique slug identifier for the comic
 * @returns The comic if found, null otherwise
 * @throws Error if comics cannot be retrieved
 *
 * Requirements: 3.1, 11.1, 11.2
 */
export const getComicBySlug = cache(
  async (slug: string): Promise<Comic | null> => {
    try {
      const comics = await getAllComics();
      return comics.find((comic) => comic.slug === slug) || null;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to retrieve comic by slug "${slug}": ${message}`);
    }
  }
);

/**
 * Retrieves the most recently published comic
 * Uses publish date with slug as tiebreaker for consistent results
 *
 * @returns The latest comic
 * @throws Error if no comics exist or comics cannot be retrieved
 *
 * Requirements: 1.3, 1.4
 */
export const getLatestComic = cache(async (): Promise<Comic> => {
  try {
    const comics = await getAllComics();

    if (comics.length === 0) {
      throw new Error('No comics available');
    }

    // Comics are already sorted by date descending, so first is latest
    return comics[0];
  } catch (error) {
    if (error instanceof Error && error.message === 'No comics available') {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to retrieve latest comic: ${message}`);
  }
});

/**
 * Retrieves all comics that include a specific tag
 * Results maintain the same chronological ordering as getAllComics()
 *
 * @param tag - The tag to filter by
 * @returns Array of comics containing the specified tag
 * @throws Error if comics cannot be retrieved
 *
 * Requirements: 2.3
 */
export const getComicsByTag = cache(async (tag: string): Promise<Comic[]> => {
  try {
    const comics = await getAllComics();
    return comics.filter((comic) => comic.frontmatter.tags.includes(tag));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to retrieve comics by tag "${tag}": ${message}`);
  }
});

/**
 * Retrieves all unique tags from all comics
 * Tags are sorted alphabetically for consistent display
 *
 * @returns Array of unique tag strings sorted alphabetically
 * @throws Error if comics cannot be retrieved
 *
 * Requirements: 2.3
 */
export const getAllTags = cache(async (): Promise<string[]> => {
  try {
    const comics = await getAllComics();

    // Collect all tags from all comics
    const allTags = comics.flatMap((comic) => comic.frontmatter.tags);

    // Get unique tags and sort alphabetically
    const uniqueTags = Array.from(new Set(allTags)).sort();

    return uniqueTags;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to retrieve all tags: ${message}`);
  }
});

/**
 * Selects a random comic from all available comics
 *
 * @returns A randomly selected comic
 * @throws Error if no comics exist or comics cannot be retrieved
 *
 * Requirements: 2.4
 */
export const getRandomComic = cache(async (): Promise<Comic> => {
  try {
    const comics = await getAllComics();

    if (comics.length === 0) {
      throw new Error('No comics available');
    }

    const randomIndex = Math.floor(Math.random() * comics.length);
    return comics[randomIndex];
  } catch (error) {
    if (error instanceof Error && error.message === 'No comics available') {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to retrieve random comic: ${message}`);
  }
});

/**
 * Retrieves the previous and next comics relative to a given comic slug
 * Based on chronological ordering (publish date with slug tiebreaker)
 *
 * @param slug - The slug of the current comic
 * @returns Object containing previous and next comics (null if at boundaries)
 * @throws Error if comics cannot be retrieved
 *
 * Requirements: 3.3, 3.4, 3.5
 */
export const getAdjacentComics = cache(
  async (
    slug: string
  ): Promise<{
    previous: Comic | null;
    next: Comic | null;
  }> => {
    try {
      const comics = await getAllComics();
      const currentIndex = comics.findIndex((comic) => comic.slug === slug);

      if (currentIndex === -1) {
        return { previous: null, next: null };
      }

      // Previous comic is the one published before (later in array, older date)
      const previous =
        currentIndex < comics.length - 1 ? comics[currentIndex + 1] : null;

      // Next comic is the one published after (earlier in array, newer date)
      const next = currentIndex > 0 ? comics[currentIndex - 1] : null;

      return { previous, next };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to retrieve adjacent comics for "${slug}": ${message}`
      );
    }
  }
);
