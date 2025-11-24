import { getLatestComic, getAllComics } from '@/lib/comics';
import { generateHomeMetadata } from '@/lib/seo';
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

  return (
    <>
      {/* Latest Issue Hero */}
      <LatestIssueHero comic={latestComic} />

      {/* About Mumo Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Mumo
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Mumo is your guide through the wild world of technology and
              streaming. Every week, join Mumo on new adventures as they
              navigate cable chaos, streaming services, and the ever-changing
              digital landscape.
            </p>
            <p className="text-lg text-gray-600">
              Whether you&apos;re a tech enthusiast or just trying to figure out
              which streaming service has your favorite show, Mumo&apos;s got
              you covered with humor, heart, and a whole lot of confusion.
            </p>
          </div>
        </div>
      </section>

      {/* Archive Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Recent Comics
              </h2>
              <p className="text-gray-600">
                Catch up on the latest Mumo adventures
              </p>
            </div>
            <Button href="/archive" variant="outline" size="md">
              View All Comics
            </Button>
          </div>

          {/* Comics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentComics.map((comic, index) => (
              <ComicCard
                key={comic.slug}
                comic={comic}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section Placeholder */}
      <section className="py-16 bg-gradient-to-br from-mumo-blue to-mumo-yellow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Never Miss an Adventure
          </h2>
          <p className="text-lg text-white mb-8 opacity-95">
            Get notified when new Mumo comics are published. Subscribe via email
            or RSS feed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/api/rss"
              variant="secondary"
              size="lg"
              external
              className="bg-white text-mumo-blue hover:bg-opacity-90"
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
                Subscribe via RSS
              </span>
            </Button>
            <div className="text-white text-sm opacity-75 flex items-center justify-center">
              Email subscription coming soon!
            </div>
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
