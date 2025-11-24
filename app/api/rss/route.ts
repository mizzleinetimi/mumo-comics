import { NextResponse } from 'next/server';
import { getAllComics } from '@/lib/comics';
import { generateRSSFeed } from '@/lib/rss';

/**
 * RSS Feed API Route
 * Serves an RSS 2.0 feed of the 20 most recent comics
 *
 * GET /api/rss
 *
 * Requirements: 4.3, 4.5
 */
export async function GET() {
  try {
    // Get all comics (already sorted by date descending)
    const comics = await getAllComics();

    // Generate RSS feed XML
    const rssFeed = generateRSSFeed(comics);

    // Return RSS feed with proper content type
    return new NextResponse(rssFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);

    return new NextResponse('Error generating RSS feed', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * Configure route segment options
 * This route should be dynamically rendered to include latest comics
 */
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour
