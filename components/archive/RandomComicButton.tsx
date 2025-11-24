'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

/**
 * RandomComicButton component props
 */
interface RandomComicButtonProps {
  comicSlugs: string[];
}

/**
 * RandomComicButton component for navigating to a random comic
 *
 * Features:
 * - Client-side random selection from available comics
 * - Navigate to randomly selected comic on click
 * - Prominent CTA button style
 * - Fun animation/icon
 * - Proper ARIA label
 *
 * @example
 * <RandomComicButton comicSlugs={allComicSlugs} />
 *
 * Requirements: 2.4, 7.1
 */
export function RandomComicButton({ comicSlugs }: RandomComicButtonProps) {
  const router = useRouter();

  const handleRandomComic = () => {
    if (comicSlugs.length === 0) return;

    const randomIndex = Math.floor(Math.random() * comicSlugs.length);
    const randomSlug = comicSlugs[randomIndex];

    router.push(`/comics/${randomSlug}`);
  };

  if (comicSlugs.length === 0) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleRandomComic}
      ariaLabel="Read a random comic"
      className="group"
    >
      <span className="flex items-center gap-2">
        <svg
          className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Read Random Comic
      </span>
    </Button>
  );
}
