import { getAllComics, getAllTags } from '@/lib/comics';
import { generateArchiveMetadata } from '@/lib/seo';
import { ComicCard } from '@/components/comics/ComicCard';
import { ArchiveFilters } from '@/components/archive/ArchiveFilters';
import { RandomComicButton } from '@/components/archive/RandomComicButton';

/**
 * Generate metadata for archive page
 *
 * Requirements: 8.1
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { tags?: string };
}) {
  const activeTag = searchParams.tags?.split(',')[0];
  return generateArchiveMetadata(activeTag);
}

/**
 * Archive page component
 *
 * Features:
 * - Display all comics in reverse chronological order
 * - Tag filtering based on URL query parameters
 * - ArchiveFilters component with all available tags
 * - ComicCard grid with filtered results
 * - RandomComicButton
 * - Responsive grid (1 column mobile, 2 tablet, 3 desktop)
 * - ISR with 5-minute revalidation
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.4, 14.1, 14.2, 14.3
 */
export default async function ArchivePage({
  searchParams,
}: {
  searchParams: { tags?: string };
}) {
  // Fetch all comics and tags - triggering rebuild
  const allComics = await getAllComics();
  const allTags = await getAllTags();

  // Filter comics by tags if specified
  const activeTags = searchParams.tags?.split(',').filter(Boolean) || [];
  const filteredComics =
    activeTags.length > 0
      ? allComics.filter((comic) =>
        activeTags.some((tag) => comic.frontmatter.tags.includes(tag))
      )
      : allComics;

  // Get all comic slugs for random button
  const comicSlugs = allComics.map((comic) => comic.slug);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comic Archive
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Browse all {allComics.length} Mumo comics. Filter by tags or
            discover something new!
          </p>
          <RandomComicButton comicSlugs={comicSlugs} />
        </div>

        {/* Filters */}
        <ArchiveFilters allTags={allTags} />

        {/* Comics Grid */}
        {filteredComics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComics.map((comic) => (
              <ComicCard key={comic.slug} comic={comic} priority={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No comics found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or browse all comics.
            </p>
            <RandomComicButton comicSlugs={comicSlugs} />
          </div>
        )}

        {/* Results Count */}
        {filteredComics.length > 0 && activeTags.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredComics.length} of {allComics.length} comics
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Configure ISR for archive page
 * Revalidate every 5 minutes
 *
 * Requirements: 10.4
 */
export const revalidate = 300;
