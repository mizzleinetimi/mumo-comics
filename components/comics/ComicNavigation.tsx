'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { Comic } from '@/types/comic';

/**
 * ComicNavigation component props
 */
interface ComicNavigationProps {
  previousComic: Comic | null;
  nextComic: Comic | null;
}

/**
 * ComicNavigation component for navigating between comics
 *
 * Features:
 * - Previous and next comic links with titles
 * - Disabled/hidden navigation at sequence boundaries
 * - Keyboard shortcuts (arrow keys) for navigation
 * - Prefetching on hover for better performance
 * - Mumo branding styles
 *
 * @example
 * <ComicNavigation previousComic={prev} nextComic={next} />
 *
 * Requirements: 3.3, 3.4, 3.5
 */
export function ComicNavigation({
  previousComic,
  nextComic,
}: ComicNavigationProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && previousComic) {
        window.location.href = `/comics/${previousComic.slug}`;
      } else if (e.key === 'ArrowRight' && nextComic) {
        window.location.href = `/comics/${nextComic.slug}`;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previousComic, nextComic]);

  return (
    <nav
      className="border-t border-b border-gray-200 py-8 my-12"
      aria-label="Comic navigation"
    >
      <div className="flex justify-between items-center gap-4">
        {/* Previous Comic */}
        <div className="flex-1">
          {previousComic ? (
            <Link
              href={`/comics/${previousComic.slug}`}
              className="group flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              prefetch={true}
            >
              <svg
                className="w-6 h-6 text-mumo-orange group-hover:scale-110 transition-transform flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="text-left">
                <div className="text-sm text-gray-500 mb-1">Previous</div>
                <div className="font-semibold text-gray-900 group-hover:text-mumo-orange transition-colors line-clamp-2">
                  {previousComic.frontmatter.title}
                </div>
              </div>
            </Link>
          ) : (
            <div className="p-4 text-gray-400 flex items-center gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div className="text-left">
                <div className="text-sm">No previous comic</div>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Hint */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-xs">
            ←
          </kbd>
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 text-xs">
            →
          </kbd>
        </div>

        {/* Next Comic */}
        <div className="flex-1">
          {nextComic ? (
            <Link
              href={`/comics/${nextComic.slug}`}
              className="group flex items-center justify-end gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              prefetch={true}
            >
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Next</div>
                <div className="font-semibold text-gray-900 group-hover:text-mumo-orange transition-colors line-clamp-2">
                  {nextComic.frontmatter.title}
                </div>
              </div>
              <svg
                className="w-6 h-6 text-mumo-orange group-hover:scale-110 transition-transform flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <div className="p-4 text-gray-400 flex items-center justify-end gap-3">
              <div className="text-right">
                <div className="text-sm">No next comic</div>
              </div>
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
