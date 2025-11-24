import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Badge, BadgeGroup } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Comic } from '@/types/comic';

/**
 * ComicCard component props
 */
interface ComicCardProps {
  comic: Comic;
  priority?: boolean;
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
 * ComicCard component for displaying comic information in a card format
 * Used in archive page and home page preview
 *
 * Features:
 * - Cover image with Next.js Image optimization
 * - Title, synopsis, publish date, reading time
 * - Tags as badges
 * - Responsive layout
 * - Hover effects
 * - Proper alt text for accessibility
 *
 * @example
 * <ComicCard comic={comic} priority={false} />
 *
 * Requirements: 1.1, 2.2, 7.2, 14.1, 14.2, 14.3
 */
export function ComicCard({ comic, priority = false }: ComicCardProps) {
  const { title, synopsis, publishDate, readingTime, coverImage, tags } =
    comic.frontmatter;
  const comicUrl = `/comics/${comic.slug}`;

  return (
    <Card
      hover
      className="h-full flex flex-col bg-white rounded-2xl border-3 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Cover Image */}
      <Link
        href={comicUrl}
        className="block relative aspect-video overflow-hidden rounded-t-xl border-b-3 border-black"
      >
        <Image
          src={coverImage}
          alt={`Cover image for ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={priority}
        />
      </Link>

      {/* Card Content */}
      <CardHeader className="p-5 pb-2">
        <Link href={comicUrl} className="group">
          <h3 className="text-2xl font-heading font-bold text-black group-hover:text-mumo-orange transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 px-5 py-2">
        <div className="text-gray-800 text-base font-medium line-clamp-3 mb-4">
          {synopsis}
        </div>

        {/* Tags */}
        <BadgeGroup className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="primary"
              size="sm"
              className="bg-mumo-yellow text-black border-2 border-black font-bold shadow-hard-sm"
            >
              {tag}
            </Badge>
          ))}
        </BadgeGroup>
      </CardContent>

      {/* Card Footer with Metadata and CTA */}
      <CardFooter className="flex items-center justify-between p-5 pt-4 border-t-3 border-black bg-gray-50 rounded-b-xl">
        <div className="flex flex-col text-xs font-bold text-gray-600">
          <span>{formatDate(publishDate)}</span>
          <span className="mt-1">{readingTime} min read</span>
        </div>
        <Button
          href={comicUrl}
          variant="primary"
          size="sm"
          ariaLabel={`Read ${title}`}
        >
          Read Comic
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * ComicCardSkeleton component for loading states
 * Shows a placeholder while comics are being loaded
 */
export function ComicCardSkeleton() {
  return (
    <Card className="h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-300 rounded-t-lg" />

      {/* Content Skeleton */}
      <CardHeader>
        <div className="h-6 bg-gray-300 rounded w-3/4" />
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-300 rounded w-full" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
          <div className="h-4 bg-gray-300 rounded w-4/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-300 rounded-full w-16" />
          <div className="h-6 bg-gray-300 rounded-full w-20" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="space-y-1">
          <div className="h-3 bg-gray-300 rounded w-24" />
          <div className="h-3 bg-gray-300 rounded w-16" />
        </div>
        <div className="h-8 bg-gray-300 rounded w-24" />
      </CardFooter>
    </Card>
  );
}
