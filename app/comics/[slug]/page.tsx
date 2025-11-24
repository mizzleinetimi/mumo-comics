import { notFound } from 'next/navigation';
import { getAllComics, getComicBySlug, getAdjacentComics } from '@/lib/comics';
import {
  generateComicMetadata,
  generateArticleSchema,
  generateComicBreadcrumbs,
  generateBreadcrumbSchema,
  serializeSchema,
} from '@/lib/seo';
import { MDXRenderer } from '@/components/comics/MDXRenderer';
import { ComicNavigation } from '@/components/comics/ComicNavigation';
import { Badge, BadgeGroup } from '@/components/ui/Badge';

/**
 * Generate static params for all comics
 * Pre-renders all comic pages at build time
 *
 * Requirements: 10.1
 */
export async function generateStaticParams() {
  const comics = await getAllComics();
  return comics.map((comic) => ({
    slug: comic.slug,
  }));
}

/**
 * Generate metadata for comic detail page
 *
 * Requirements: 8.1, 8.2, 8.3
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const comic = await getComicBySlug(params.slug);

  if (!comic) {
    return {
      title: 'Comic Not Found | Mumo Comics',
    };
  }

  return generateComicMetadata(comic);
}

/**
 * Comic detail page component
 *
 * Features:
 * - MDX content rendering
 * - Previous/Next navigation
 * - Metadata and structured data
 * - ISR with 1-hour revalidation
 * - 404 handling for invalid slugs
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 10.1
 */
export default async function ComicPage({
  params,
}: {
  params: { slug: string };
}) {
  const comic = await getComicBySlug(params.slug);

  if (!comic) {
    notFound();
  }

  const { previous, next } = await getAdjacentComics(params.slug);
  const articleSchema = generateArticleSchema(comic);
  const breadcrumbs = generateComicBreadcrumbs(comic);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const { title, publishDate, readingTime, tags, author } = comic.frontmatter;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />

      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <time dateTime={publishDate}>
                {new Date(publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{readingTime} min read</span>
              {author && (
                <>
                  <span>•</span>
                  <span>By {author}</span>
                </>
              )}
            </div>

            {/* Tags */}
            <BadgeGroup>
              {tags.map((tag) => (
                <Badge key={tag} variant="primary" size="md">
                  {tag}
                </Badge>
              ))}
            </BadgeGroup>
          </header>

          {/* Comic Content */}
          <MDXRenderer content={comic.content} />

          {/* Navigation */}
          <ComicNavigation previousComic={previous} nextComic={next} />
        </div>
      </article>
    </>
  );
}

/**
 * Configure ISR for comic detail pages
 * Revalidate every hour
 *
 * Requirements: 10.1
 */
export const revalidate = 3600;
