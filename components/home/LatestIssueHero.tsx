import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Comic } from '@/types/comic';

/**
 * LatestIssueHero component props
 */
interface LatestIssueHeroProps {
  comic: Comic;
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
  const { title, synopsis, readingTime, coverImage, tags } =
    comic.frontmatter;
  const comicUrl = `/comics/${comic.slug}`;

  return (
    <section
      className="bg-mumo-blue border-b-3 border-black py-12 relative overflow-hidden"
      aria-labelledby="latest-issue-title"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      {/* Cartoon Clouds */}
      <div className="absolute top-8 left-10 w-40 h-20 opacity-90 animate-float">
        <Image src="/images/cloud.svg" alt="" fill className="object-contain" />
      </div>
      <div className="absolute top-16 right-16 w-56 h-28 opacity-70 animate-float-slow">
        <Image src="/images/cloud.svg" alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-12 left-1/4 w-32 h-16 opacity-80 animate-float-slower">
        <Image src="/images/cloud.svg" alt="" fill className="object-contain" />
      </div>
      <div className="absolute top-1/3 right-1/3 w-48 h-24 opacity-60 animate-float">
        <Image src="/images/cloud.svg" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Poster Container */}
        <div className="relative inline-block">

          {/* Title - Overlaid on top */}
          <div className="relative z-20 -mb-12 transform -rotate-2">
            <span className="block text-xl font-bold text-white tracking-widest uppercase mb-1 drop-shadow-md">The Mumo Show Presents</span>
            <h1
              id="latest-issue-title"
              className="text-6xl md:text-8xl font-heading font-bold text-mumo-orange text-stroke-3 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              {title}
            </h1>
          </div>

          {/* Cover Image - Poster Style */}
          <div className="relative z-10 bg-white p-4 pb-16 rounded-3xl border-3 border-black shadow-hard-lg transform rotate-1 mx-auto max-w-md md:max-w-lg">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-black">
              <Image
                src={coverImage}
                alt={`Cover image for ${title}`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                priority
              />

              {/* Latest Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-block bg-mumo-yellow text-black border-2 border-black font-bold px-3 py-1 rounded-full text-sm uppercase tracking-wide shadow-hard-sm transform rotate-3">
                  New Episode!
                </span>
              </div>
            </div>

            {/* Metadata inside the poster frame */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex justify-center flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="bg-gray-100 text-black border-2 border-black font-bold"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="text-lg font-medium text-gray-900 line-clamp-3 px-2">
                {synopsis}
              </div>

              <div className="pt-2">
                <Button
                  href={comicUrl}
                  variant="primary"
                  size="lg"
                  className="shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all font-heading text-xl"
                >
                  <span className="flex items-center gap-3">
                    Read Now!
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </Button>
                <p className="text-sm text-gray-700 font-medium">
                  {readingTime} min read
                </p>  </div>
            </div>
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
