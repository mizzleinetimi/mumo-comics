import { MetadataRoute } from 'next';
import { getAllComics } from '@/lib/comics';

/**
 * Base URL for the site - should be set via environment variable in production
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Generates a dynamic sitemap for the Mumo Comics site
 * Includes home page, archive page, and all comic detail pages
 *
 * This function is called by Next.js to generate the sitemap.xml file
 *
 * @returns Array of sitemap entries
 *
 * Requirements: 8.4
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all comics
    const comics = await getAllComics();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/archive`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];

    // Comic detail pages
    const comicPages: MetadataRoute.Sitemap = comics.map((comic) => ({
      url: `${SITE_URL}/comics/${comic.slug}`,
      lastModified: new Date(comic.frontmatter.publishDate),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Combine all pages
    return [...staticPages, ...comicPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return at least the static pages if comics can't be loaded
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/archive`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];
  }
}
