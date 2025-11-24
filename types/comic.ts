// Core data types for Mumo Comics

export interface ComicFrontmatter {
  title: string;
  slug: string;
  publishDate: string; // ISO 8601 format
  synopsis: string;
  tags: string[];
  readingTime: number; // minutes
  coverImage: string; // relative path from public/
  author?: string;
  featured?: boolean;
}

export interface Comic {
  frontmatter: ComicFrontmatter;
  content: string; // Raw MDX content
  slug: string;
}

export interface ComicWithMetadata extends Comic {
  previousComic: { slug: string; title: string } | null;
  nextComic: { slug: string; title: string } | null;
  wordCount: number;
  estimatedReadingTime: number;
}

export interface ArchiveFilters {
  tags?: string[];
  sortBy?: 'date-desc' | 'date-asc' | 'title';
  limit?: number;
}
