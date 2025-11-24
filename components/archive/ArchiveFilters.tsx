'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

/**
 * ArchiveFilters component props
 */
interface ArchiveFiltersProps {
  allTags: string[];
}

/**
 * ArchiveFilters component for filtering comics by tags
 *
 * Features:
 * - Display all available tags as filter pills/buttons
 * - Highlight active filters
 * - Update URL query parameters when filters change
 * - Support multiple tag selection
 * - Clear filters button
 * - Keyboard navigation and ARIA labels
 *
 * @example
 * <ArchiveFilters allTags={tags} />
 *
 * Requirements: 2.3, 2.5, 7.1
 */
export function ArchiveFilters({ allTags }: ArchiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active tags from URL
  const activeTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  /**
   * Toggle a tag filter
   */
  const toggleTag = (tag: string) => {
    const newTags = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];

    updateURL(newTags);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    updateURL([]);
  };

  /**
   * Update URL with new tag filters
   */
  const updateURL = (tags: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    } else {
      params.delete('tags');
    }

    router.push(`/archive?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filter by Tags</h2>
        {activeTags.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            ariaLabel="Clear all filters"
          >
            Clear Filters ({activeTags.length})
          </Button>
        )}
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Tag filters"
      >
        {allTags.map((tag) => {
          const isActive = activeTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant="outline"
              size="md"
              onClick={() => toggleTag(tag)}
              active={isActive}
              ariaLabel={`${isActive ? 'Remove' : 'Add'} ${tag} filter`}
            >
              {tag}
            </Badge>
          );
        })}
      </div>

      {activeTags.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing comics tagged with:{' '}
          <span className="font-semibold">{activeTags.join(', ')}</span>
        </div>
      )}
    </div>
  );
}
