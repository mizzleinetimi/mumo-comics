import { getLatestComic, getAllComics } from '@/lib/comics';
import { generateHomeMetadata } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import { LatestIssueHero } from '@/components/home/LatestIssueHero';
import { ComicCard } from '@/components/comics/ComicCard';
import { Button } from '@/components/ui/Button';

/**
 * Generate metadata for the home page
 * Includes the latest comic title in the description
 *
 * Requirements: 8.1
 */
export async function generateMetadata() {
  try {
    const latestComic = await getLatestComic();
    if (!latestComic) {
      return generateHomeMetadata();
    }
    return generateHomeMetadata(latestComic.frontmatter.title);
  } catch {
    return generateHomeMetadata();
  }
}

/**
 * Home page component
 * Features:
 * - Latest issue hero section
 * - About Mumo section
 * - Archive preview with 3 recent comics
 * - Subscribe section placeholder
 *
 * Requirements: 1.1, 1.2, 1.3, 1.5, 10.3
 */
export default async function Home() {
  // Fetch latest comic and recent comics
  const latestComic = await getLatestComic();
  const allComics = await getAllComics();
  const recentComics = allComics.slice(0, 3);

  // If no comics exist, show empty state
  if (!latestComic || allComics.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="w-32 h-32 bg-mumo-yellow border-3 border-black rounded-full flex items-center justify-center mx-auto mb-8">
            <Image
              src="/images/yam.svg"
              alt="Yam"
              width={64}
              height={64}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">
            Welcome to Mumo Comics!
          </h1>
          <p className="text-xl text-gray-600 font-medium mb-8">
            No comics have been published yet. Check back soon for amazing adventures!
          </p>
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-mumo-orange text-white font-heading font-bold rounded-xl border-3 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all"
          >
            Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Latest Issue Hero */}
      <LatestIssueHero comic={latestComic} />

      {/* Recent Episodes Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-heading font-bold text-black mb-2 text-stroke-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                More Episodes
              </h2>
            </div>
            <Button href="/archive" variant="outline" size="md">
              View All
            </Button>
          </div>

          {/* Comics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentComics.map((comic, index) => (
              <ComicCard key={comic.slug} comic={comic} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Yam Club / Subscribe Section */}
      <section className="py-16 bg-mumo-yellow border-t-3 border-black relative overflow-hidden">
        {/* Yam Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/yam.svg)',
            backgroundSize: '60px 60px',
            backgroundRepeat: 'repeat',
            transform: 'rotate(-5deg)'
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-black mb-6 text-stroke-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3">
            Join the Yam Club!
            <Image
              src="/images/yam.svg"
              alt="Yam"
              width={48}
              height={48}
              className="inline-block transform rotate-12 drop-shadow-md"
            />
          </h2>
          <p className="text-xl font-bold text-black mb-8">
            Get fresh yams (and episodes) delivered to your inbox!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/api/rss"
              variant="primary"
              size="lg"
              external
              className="shadow-hard hover:shadow-hard-lg"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
                </svg>
                RSS Feed
              </span>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Configure ISR for the home page
 * Revalidate every 60 seconds to show latest comics
 *
 * Requirements: 10.3
 */
export const revalidate = 60;
