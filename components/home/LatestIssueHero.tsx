import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeGroup } from '@/components/ui/Badge';
import type { Comic } from '@/types/comic';

/**
 * LatestIssueHero component props
 */
interface LatestIssueHeroProps {
  comic: Comic;
}

/**
 * Formats a date string to a readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * LatestIssueHero component for displaying the latest comic in a hero section
 * Features a large cover image, title, synopsis, and prominent CTA button
 *
 * Layout:
 * - Mobile: Stacked (image on top, content below)
 * - Desktop: Side-by-side (image left, content right)
 *
 * @example
 * <LatestIssueHero comic={latestComic} />
 *
 * Requirements: 1.1, 1.2, 7.1
 */
export function LatestIssueHero({ comic }: LatestIssueHeroProps) {
  const { title, synopsis, publishDate, readingTime, coverImage, tags } =
    comic.frontmatter;
  const comicUrl = `/comics/${comic.slug}`;

  return (
    <section
      className="bg-mumo-yellow border-b-3 border-black py-12 md:py-20 relative overflow-hidden"
      aria-labelledby="latest-issue-title"
    >
      {/* Decorative dots pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Latest Issue Label */}
        <div className="mb-8">
          <span className="inline-block bg-white text-black border-3 border-black font-heading font-bold px-6 py-2 rounded-full text-base uppercase tracking-wide shadow-hard transform -rotate-2">
            ✨ Latest Issue
          </span>
        </div>

        {/* Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Cover Image */}
          <div className="relative aspect-[3/4] lg:aspect-square rounded-2xl overflow-hidden border-3 border-black shadow-hard-lg bg-white transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <Image
              src={coverImage}
              alt={`Cover image for ${title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="text-black">
            {/* Title */}
            <h1
              id="latest-issue-title"
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-none text-black drop-shadow-sm"
            >
              {title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm md:text-base font-bold bg-white inline-flex p-3 rounded-xl border-2 border-black shadow-hard-sm">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(publishDate)}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readingTime} min read
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-xl md:text-2xl mb-8 leading-relaxed font-medium text-gray-900">
              {synopsis}
            </p>

            {/* Tags */}
            <div className="mb-10">
              <BadgeGroup className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    size="md"
                    className="bg-white text-black border-2 border-black font-bold shadow-hard-sm hover:shadow-hard hover:-translate-y-0.5 transition-all"
                  >
                    {tag}
                  </Badge>
                ))}
              </BadgeGroup>
            </div>

            {/* CTA Button */}
            <Button
              href={comicUrl}
              variant="primary"
              size="lg"
              className="text-xl px-8 py-4"
              ariaLabel={`Start reading ${title}`}
            >
              <span className="flex items-center gap-3">
                Start Reading
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * LatestIssueHeroSkeleton component for loading states
 */
export function LatestIssueHeroSkeleton() {
  return (
    <section className="bg-gradient-to-br from-mumo-orange to-mumo-yellow py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="inline-block bg-white h-8 w-32 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Skeleton */}
          <div className="aspect-[3/4] lg:aspect-square bg-white bg-opacity-30 rounded-2xl animate-pulse" />

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="h-12 bg-white bg-opacity-30 rounded w-3/4 animate-pulse" />
            <div className="flex gap-4">
              <div className="h-6 bg-white bg-opacity-30 rounded w-32 animate-pulse" />
              <div className="h-6 bg-white bg-opacity-30 rounded w-24 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-white bg-opacity-30 rounded w-full animate-pulse" />
              <div className="h-6 bg-white bg-opacity-30 rounded w-5/6 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-white bg-opacity-30 rounded-full w-20 animate-pulse" />
              <div className="h-8 bg-white bg-opacity-30 rounded-full w-24 animate-pulse" />
            </div>
            <div className="h-12 bg-white bg-opacity-30 rounded w-48 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
