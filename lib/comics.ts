import { cache } from 'react';
import { supabaseAdmin } from './supabase/server';
import type { Comic } from '@/types/comic';
import { compileMDX } from 'next-mdx-remote/rsc';

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
  const dateB = new Date(a.frontmatter.publishDate).getTime();

  // Sort by date descending (newest first)
  if (dateA !== dateB) {
    return dateB - dateA;
  }

  // If dates are equal, use slug as tiebreaker (alphabetical ascending)
  return a.slug.localeCompare(b.slug);
}

/**
 * Retrieves all published comics from Supabase
 * Results are sorted by publish date (newest first) with slug as tiebreaker
 *
 * This function is cached using React's cache() to prevent redundant database queries
 * within the same request lifecycle
 *
 * @returns Array of all comics sorted by publish date descending
 * @throws Error if database query fails
 */
export const getAllComics = cache(async (): Promise<Comic[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('comics')
      .select('*')
      .order('publish_date', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    // Transform database records to Comic type
    const comics: Comic[] = await Promise.all(
      data.map(async (record) => {
        return {
          slug: record.slug,
          content: record.content,
          frontmatter: {
            title: record.title,
            slug: record.slug,
            publishDate: record.publish_date,
            synopsis: record.synopsis,
            tags: record.tags || [],
            readingTime: record.reading_time || 5,
            coverImage: record.cover_image_url || '',
            author: record.author || 'Mumo Team',
            featured: record.featured || false,
          },
        };
      })
    );

    // Sort using the same logic as before
    return comics.sort(compareByDateAndSlug);
  } catch (error) {
    console.error('Error fetching comics:', error);
    throw new Error('Failed to fetch comics from database');
  }
});

/**
 * Retrieves a single comic by its slug from Supabase
 *
 * @param slug - The URL-friendly identifier for the comic
 * @returns The comic with compiled MDX content, or null if not found
 */
export const getComicBySlug = cache(
  async (slug: string): Promise<Comic | null> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('comics')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) return null;

      return {
        slug: data.slug,
        content: data.content,
        frontmatter: {
          title: data.title,
          slug: data.slug,
          publishDate: data.publish_date,
          synopsis: data.synopsis,
          tags: data.tags || [],
          readingTime: data.reading_time || 5,
          coverImage: data.cover_image_url || '',
          author: data.author || 'Mumo Team',
          featured: data.featured || false,
        },
      };
    } catch (error) {
      console.error(`Error fetching comic ${slug}:`, error);
      return null;
    }
  }
);

/**
 * Retrieves the most recently published comic
 *
 * @returns The latest comic, or null if no comics exist
 */
export const getLatestComic = cache(async (): Promise<Comic | null> => {
  const comics = await getAllComics();
  return comics.length > 0 ? comics[0] : null;
});

/**
 * Retrieves all comics that have a specific tag
 *
 * @param tag - The tag to filter by
 * @returns Array of comics with the specified tag, sorted by publish date
 */
export const getComicsByTag = cache(
  async (tag: string): Promise<Comic[]> => {
    const allComics = await getAllComics();
    return allComics.filter((comic) =>
      comic.frontmatter.tags.includes(tag)
    );
  }
);

/**
 * Retrieves all unique tags used across all comics
 * Tags are sorted by frequency (most common first)
 *
 * @returns Array of unique tag strings sorted by usage frequency
 */
export const getAllTags = cache(async (): Promise<string[]> => {
  const comics = await getAllComics();
  const tagCounts = new Map<string, number>();

  comics.forEach((comic) => {
    comic.frontmatter.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
});

/**
 * Retrieves a random comic from all published comics
 *
 * @returns A randomly selected comic, or null if no comics exist
 */
export const getRandomComic = cache(async (): Promise<Comic | null> => {
  const comics = await getAllComics();
  if (comics.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * comics.length);
  return comics[randomIndex];
});

/**
 * Gets the previous and next comics relative to a given slug
 * Used for navigation between comics
 *
 * @param slug - The slug of the current comic
 * @returns Object with previous and next comics (null if none exist)
 */
export const getAdjacentComics = cache(
  async (
    slug: string
  ): Promise<{ previous: Comic | null; next: Comic | null }> => {
    const comics = await getAllComics();
    const currentIndex = comics.findIndex((comic) => comic.slug === slug);

    if (currentIndex === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: currentIndex > 0 ? comics[currentIndex - 1] : null,
      next: currentIndex < comics.length - 1 ? comics[currentIndex + 1] : null,
    };
  }
);
