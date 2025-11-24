import type { Comic } from '@/types/comic';

/**
 * Base URL for the site - should be set via environment variable in production
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Site information for RSS feed
 */
const SITE_INFO = {
  title: 'Mumo Comics',
  description:
    'Weekly short comics featuring the character Mumo exploring technology, streaming, and modern life.',
  language: 'en-US',
  copyright: `Copyright ${new Date().getFullYear()} Mumo Comics`,
  managingEditor: 'editor@mumocomics.com (Mumo Comics Team)',
  webMaster: 'webmaster@mumocomics.com (Mumo Comics Team)',
  category: 'Comics',
};

/**
 * Escapes special XML characters to prevent malformed XML
 *
 * @param text - Text to escape
 * @returns XML-safe text
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats a date for RSS (RFC 822 format)
 * Example: "Mon, 15 Jan 2024 10:00:00 GMT"
 *
 * @param dateString - ISO 8601 date string
 * @returns RFC 822 formatted date string
 */
function formatRSSDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString();
}

/**
 * Generates an RSS item for a single comic
 *
 * @param comic - The comic to generate an RSS item for
 * @returns XML string for the RSS item
 *
 * Requirements: 4.3, 4.5
 */
export function generateRSSItem(comic: Comic): string {
  const { title, synopsis, publishDate, author, coverImage } =
    comic.frontmatter;
  const link = `${SITE_URL}/comics/${comic.slug}`;
  const imageUrl = `${SITE_URL}${coverImage}`;

  // Create a simple HTML description with the cover image and synopsis
  const description = `
    <![CDATA[
      <img src="${imageUrl}" alt="${escapeXML(title)}" style="max-width: 100%; height: auto;" />
      <p>${escapeXML(synopsis)}</p>
      <p><a href="${link}">Read the full comic</a></p>
    ]]>
  `;

  return `
    <item>
      <title>${escapeXML(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${formatRSSDate(publishDate)}</pubDate>
      <author>${escapeXML(author || SITE_INFO.managingEditor)}</author>
      <category>${SITE_INFO.category}</category>
      <enclosure url="${imageUrl}" type="image/svg+xml" />
    </item>`;
}

/**
 * Generates a complete RSS 2.0 feed from a collection of comics
 * Limits to the 20 most recent comics as specified in requirements
 *
 * @param comics - Array of comics (should be pre-sorted by date descending)
 * @returns Complete RSS 2.0 XML feed as a string
 *
 * Requirements: 4.3, 4.5
 */
export function generateRSSFeed(comics: Comic[]): string {
  // Limit to 20 most recent comics
  const recentComics = comics.slice(0, 20);

  // Get the most recent comic's publish date for lastBuildDate
  const lastBuildDate =
    recentComics.length > 0
      ? formatRSSDate(recentComics[0].frontmatter.publishDate)
      : formatRSSDate(new Date().toISOString());

  // Generate RSS items
  const items = recentComics.map(generateRSSItem).join('\n');

  // Generate complete RSS feed
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXML(SITE_INFO.title)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXML(SITE_INFO.description)}</description>
    <language>${SITE_INFO.language}</language>
    <copyright>${escapeXML(SITE_INFO.copyright)}</copyright>
    <managingEditor>${escapeXML(SITE_INFO.managingEditor)}</managingEditor>
    <webMaster>${escapeXML(SITE_INFO.webMaster)}</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <category>${escapeXML(SITE_INFO.category)}</category>
    <generator>Mumo Comics RSS Generator</generator>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${escapeXML(SITE_INFO.title)}</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;
}

/**
 * Validates that the generated RSS feed is well-formed XML
 * This is a basic check - for production, consider using a proper XML validator
 *
 * @param rssXML - The RSS XML string to validate
 * @returns true if basic validation passes
 */
export function validateRSSFeed(rssXML: string): boolean {
  // Basic checks
  if (!rssXML.includes('<?xml version="1.0"')) {
    return false;
  }

  if (!rssXML.includes('<rss version="2.0"')) {
    return false;
  }

  if (!rssXML.includes('<channel>') || !rssXML.includes('</channel>')) {
    return false;
  }

  if (!rssXML.includes('</rss>')) {
    return false;
  }

  // Check for required channel elements
  const requiredElements = ['<title>', '<link>', '<description>'];
  for (const element of requiredElements) {
    if (!rssXML.includes(element)) {
      return false;
    }
  }

  return true;
}
