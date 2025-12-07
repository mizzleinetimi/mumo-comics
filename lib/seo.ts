import type { Metadata } from 'next';
import type { Comic } from '@/types/comic';
import type { Article, BreadcrumbList, WithContext } from 'schema-dts';

/**
 * Base URL for the site - should be set via environment variable in production
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Default site metadata
 */
export const DEFAULT_METADATA = {
  siteName: 'Mumo Comics',
  description:
    'Weekly short comics featuring the character Mumo exploring technology, streaming, and modern life.',
  author: 'Mumo Comics Team',
  keywords: ['comics', 'webcomics', 'mumo', 'streaming', 'technology', 'humor'],
};

/**
 * Generates Next.js Metadata object for a comic detail page
 * Includes title, description, Open Graph tags, Twitter Card tags, and canonical URL
 *
 * @param comic - The comic to generate metadata for
 * @param ogImageUrl - Optional custom OG image URL (defaults to cover image)
 * @returns Next.js Metadata object
 *
 * Requirements: 8.1, 8.3, 8.5
 */
export function generateComicMetadata(
  comic: Comic,
  ogImageUrl?: string
): Metadata {
  const { title, synopsis, coverImage, tags, author, publishDate } =
    comic.frontmatter;
  const canonicalUrl = `${SITE_URL}/comics/${comic.slug}`;
  const imageUrl = ogImageUrl || `${SITE_URL}${coverImage}`;

  return {
    title: `${title} | Mumo Comics`,
    description: synopsis,
    authors: author ? [{ name: author }] : [{ name: DEFAULT_METADATA.author }],
    keywords: [...tags, ...DEFAULT_METADATA.keywords],

    // Canonical URL to prevent duplicate content issues
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph metadata for social media sharing
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: title,
      description: synopsis,
      siteName: DEFAULT_METADATA.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Cover image for ${title}`,
        },
      ],
      publishedTime: publishDate,
      authors: author ? [author] : [DEFAULT_METADATA.author],
      tags: tags,
    },

    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: synopsis,
      images: [imageUrl],
      creator: '@mumocomics', // Update with actual Twitter handle
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generates metadata for the home page
 *
 * @param latestComicTitle - Optional title of the latest comic to include in description
 * @returns Next.js Metadata object
 *
 * Requirements: 8.1
 */
export function generateHomeMetadata(latestComicTitle?: string): Metadata {
  const description = latestComicTitle
    ? `${DEFAULT_METADATA.description} Latest: ${latestComicTitle}`
    : DEFAULT_METADATA.description;

  return {
    title: `${DEFAULT_METADATA.siteName} - Weekly Comics About Technology and Streaming`,
    description,
    keywords: DEFAULT_METADATA.keywords,

    alternates: {
      canonical: SITE_URL,
    },

    openGraph: {
      type: 'website',
      url: SITE_URL,
      title: DEFAULT_METADATA.siteName,
      description,
      siteName: DEFAULT_METADATA.siteName,
      images: [
        {
          url: `${SITE_URL}/opengraph-image.jpg`,
          width: 1494,
          height: 2002,
          alt: 'Mumo Comics',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_METADATA.siteName,
      description,
      creator: '@mumocomics',
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generates metadata for the archive page
 *
 * @param activeTag - Optional active tag filter
 * @returns Next.js Metadata object
 *
 * Requirements: 8.1
 */
export function generateArchiveMetadata(activeTag?: string): Metadata {
  const title = activeTag
    ? `${activeTag} Comics | Archive | Mumo Comics`
    : 'Archive | Mumo Comics';

  const description = activeTag
    ? `Browse all Mumo comics tagged with "${activeTag}". ${DEFAULT_METADATA.description}`
    : `Browse all Mumo comics. ${DEFAULT_METADATA.description}`;

  const canonicalUrl = activeTag
    ? `${SITE_URL}/archive?tag=${encodeURIComponent(activeTag)}`
    : `${SITE_URL}/archive`;

  return {
    title,
    description,
    keywords: activeTag
      ? [activeTag, ...DEFAULT_METADATA.keywords]
      : DEFAULT_METADATA.keywords,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: DEFAULT_METADATA.siteName,
    },

    twitter: {
      card: 'summary',
      title,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generates JSON-LD structured data for a comic using the Article schema
 * This helps search engines understand the content and display rich results
 *
 * @param comic - The comic to generate structured data for
 * @returns JSON-LD Article schema object
 *
 * Requirements: 8.2
 */
export function generateArticleSchema(comic: Comic): WithContext<Article> {
  const { title, synopsis, coverImage, author, publishDate, tags } =
    comic.frontmatter;
  const canonicalUrl = `${SITE_URL}/comics/${comic.slug}`;
  const imageUrl = `${SITE_URL}${coverImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: synopsis,
    image: imageUrl,
    datePublished: publishDate,
    dateModified: publishDate, // Update if you track modification dates
    author: {
      '@type': 'Person',
      name: author || DEFAULT_METADATA.author,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_METADATA.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`, // Add your logo
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: tags.join(', '),
    articleSection: 'Comics',
    inLanguage: 'en-US',
  };
}

/**
 * Generates JSON-LD breadcrumb structured data for navigation
 * Helps search engines understand site hierarchy
 *
 * @param items - Array of breadcrumb items with name and url
 * @returns JSON-LD BreadcrumbList schema object
 *
 * Requirements: 8.2
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates breadcrumb items for a comic detail page
 *
 * @param comic - The comic to generate breadcrumbs for
 * @returns Array of breadcrumb items
 */
export function generateComicBreadcrumbs(
  comic: Comic
): Array<{ name: string; url: string }> {
  return [
    { name: 'Home', url: '/' },
    { name: 'Archive', url: '/archive' },
    { name: comic.frontmatter.title, url: `/comics/${comic.slug}` },
  ];
}

/**
 * Serializes JSON-LD structured data for embedding in HTML
 *
 * @param schema - The schema object to serialize
 * @returns JSON string safe for embedding in script tags
 */
export function serializeSchema(
  schema: WithContext<Article> | WithContext<BreadcrumbList>
): string {
  return JSON.stringify(schema);
}
