# Design Document

## Overview

Mumo Comics is built as a Next.js 14 application using the App Router architecture with TypeScript for type safety. The platform follows a static-first approach with Incremental Static Regeneration (ISR) to balance performance with content freshness. Content is authored in MDX files stored in the file system, with an abstraction layer that enables future migration to a headless CMS without application code changes.

The architecture emphasizes separation of concerns with distinct layers for content sourcing, business logic, and presentation. The design prioritizes Core Web Vitals through strategic use of Next.js Image optimization, lazy loading, and static generation. SEO is built into every page through comprehensive metadata generation, structured data, and automated feed generation.

The visual design takes inspiration from the provided Mumo branding - featuring a playful, cartoon aesthetic with bold orange and yellow colors, rounded shapes, and a friendly character-driven approach. The UI maintains this fun, approachable tone while ensuring professional functionality and accessibility compliance.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel Platform                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js 14 App Router                     │ │
│  │                                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Pages      │  │  API Routes  │  │  Middleware │ │ │
│  │  │  (RSC/SSG)   │  │  (OG Images) │  │             │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └─────────────┘ │ │
│  │         │                 │                           │ │
│  │         └─────────┬───────┘                           │ │
│  │                   │                                   │ │
│  │         ┌─────────▼────────┐                          │ │
│  │         │   Business Logic  │                          │ │
│  │         │   (lib/comics.ts) │                          │ │
│  │         └─────────┬────────┘                          │ │
│  │                   │                                   │ │
│  │         ┌─────────▼────────┐                          │ │
│  │         │  Content Layer    │                          │ │
│  │         │  (MDX Parser)     │                          │ │
│  │         └─────────┬────────┘                          │ │
│  └───────────────────┼────────────────────────────────────┘ │
│                      │                                      │
│            ┌─────────▼────────┐                            │
│            │  File System      │                            │
│            │  content/comics/  │                            │
│            └──────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Framework & Runtime:**

- Next.js 14.2+ with App Router
- React 18+ with Server Components
- TypeScript 5.3+ for type safety
- Node.js 20+ LTS

**Styling:**

- Tailwind CSS 3.4+ with custom configuration
- CSS Variables for theming (orange/yellow palette from Mumo branding)
- PostCSS for processing

**Content Management:**

- MDX for comic authoring with frontmatter
- gray-matter for frontmatter parsing
- next-mdx-remote or @next/mdx for MDX rendering
- Zod for runtime schema validation

**Image Optimization:**

- Next.js Image component with automatic optimization
- Sharp for build-time image processing
- WebP generation with fallbacks

**SEO & Feeds:**

- next-sitemap for XML sitemap generation
- Custom RSS feed generator
- JSON-LD structured data
- @vercel/og for dynamic OG image generation

**Testing:**

- Vitest for unit tests
- Playwright for E2E tests
- @axe-core/playwright for accessibility testing
- Percy or Chromatic for visual regression (optional)

**Development Tools:**

- ESLint with Next.js config
- Prettier for code formatting
- Husky for git hooks
- lint-staged for pre-commit checks

**Deployment & Monitoring:**

- Vercel for hosting with ISR support
- Vercel Analytics for Core Web Vitals
- GitHub Actions for CI/CD

### Directory Structure

```
mumo-comics/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                 # Lint, test, build pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── new-comic.md
│   │   ├── bug-report.md
│   │   └── feature-request.md
│   └── pull_request_template.md
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with metadata
│   │   ├── page.tsx               # Home page with latest issue hero
│   │   ├── comics/
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Comic detail pages (SSG)
│   │   ├── archive/
│   │   │   └── page.tsx           # Archive with filters
│   │   ├── api/
│   │   │   ├── og/
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts   # Dynamic OG images
│   │   │   └── rss/
│   │   │       └── route.ts       # RSS feed endpoint
│   │   ├── sitemap.ts             # Dynamic sitemap generation
│   │   └── robots.ts              # Robots.txt generation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── home/
│   │   │   ├── LatestIssueHero.tsx
│   │   │   ├── ArchivePreview.tsx
│   │   │   └── SubscribeSection.tsx
│   │   ├── comics/
│   │   │   ├── ComicCard.tsx
│   │   │   ├── ComicNavigation.tsx
│   │   │   └── MDXRenderer.tsx
│   │   ├── archive/
│   │   │   ├── ArchiveFilters.tsx
│   │   │   ├── TagFilter.tsx
│   │   │   └── RandomComicButton.tsx
│   │   ├── forms/
│   │   │   └── SubscribeForm.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── comics.ts              # Core content API
│   │   ├── mdx.ts                 # MDX processing utilities
│   │   ├── seo.ts                 # SEO metadata generation
│   │   ├── rss.ts                 # RSS feed generation
│   │   ├── schema.ts              # Zod schemas for validation
│   │   └── utils.ts               # General utilities
│   ├── types/
│   │   └── comic.ts               # TypeScript interfaces
│   └── styles/
│       └── globals.css            # Global styles & Tailwind
├── content/
│   └── comics/
│       ├── 2024-01-mumo-meets-world.mdx
│       ├── 2024-02-cable-chaos.mdx
│       └── 2024-03-streaming-dreams.mdx
├── public/
│   ├── comics/
│   │   ├── mumo-meets-world/
│   │   │   ├── cover.webp
│   │   │   ├── panel-01.webp
│   │   │   └── panel-02.webp
│   │   └── cable-chaos/
│   │       └── ...
│   ├── fonts/
│   └── favicon.ico
├── scripts/
│   ├── new-comic.ts               # Interactive comic scaffolding
│   ├── optimize-images.ts         # Batch image optimization
│   └── validate-content.ts        # Content validation
├── tests/
│   ├── unit/
│   │   ├── comics.test.ts
│   │   ├── rss.test.ts
│   │   └── seo.test.ts
│   └── e2e/
│       ├── home.spec.ts
│       ├── archive.spec.ts
│       └── comic-detail.spec.ts
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── package.json
├── CONTRIBUTING.md
└── README.md
```

## Components and Interfaces

### Core Data Types

```typescript
// src/types/comic.ts

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
```

### Content API (lib/comics.ts)

```typescript
// Core abstraction layer for content sourcing

export async function getAllComics(): Promise<Comic[]>;
export async function getComicBySlug(slug: string): Promise<Comic | null>;
export async function getLatestComic(): Promise<Comic>;
export async function getComicsByTag(tag: string): Promise<Comic[]>;
export async function getAllTags(): Promise<string[]>;
export async function getRandomComic(): Promise<Comic>;
export async function getAdjacentComics(slug: string): Promise<{
  previous: Comic | null;
  next: Comic | null;
}>;
```

**Implementation Notes:**

- All functions are async to support future CMS integration
- Functions return normalized data structures regardless of source
- Caching layer using React cache() for request deduplication
- Validation using Zod schemas on all parsed frontmatter
- Sorting by publishDate with slug as tiebreaker for consistency

### MDX Processing (lib/mdx.ts)

```typescript
export async function parseMDXFile(filePath: string): Promise<{
  frontmatter: ComicFrontmatter;
  content: string;
}>;

export async function renderMDX(content: string): Promise<{
  code: string;
  frontmatter: ComicFrontmatter;
}>;

export function validateFrontmatter(data: unknown): ComicFrontmatter;
```

### SEO Utilities (lib/seo.ts)

```typescript
export function generateComicMetadata(comic: Comic): Metadata;

export function generateArticleSchema(comic: Comic): WithContext<Article>;

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList>;
```

### RSS Generation (lib/rss.ts)

```typescript
export async function generateRSSFeed(comics: Comic[]): Promise<string>;

export function generateRSSItem(comic: Comic): string;
```

## Data Models

### MDX Frontmatter Schema

```yaml
---
title: 'Mumo Meets World'
slug: 'mumo-meets-world'
publishDate: '2024-01-15T10:00:00Z'
synopsis: 'Mumo discovers the internet for the first time and learns about streaming services.'
tags: ['origin-story', 'technology', 'adventure']
readingTime: 5
coverImage: '/comics/mumo-meets-world/cover.webp'
author: 'Mumo Comics Team'
featured: true
---
```

**Validation Rules:**

- `title`: Required, 1-100 characters
- `slug`: Required, lowercase, alphanumeric with hyphens, unique
- `publishDate`: Required, valid ISO 8601 datetime
- `synopsis`: Required, 10-300 characters
- `tags`: Required, array of 1-5 tags, each 2-20 characters
- `readingTime`: Required, positive integer (minutes)
- `coverImage`: Required, valid path starting with /comics/
- `author`: Optional, 1-50 characters
- `featured`: Optional, boolean

### File System Structure

```
content/comics/
├── 2024-01-mumo-meets-world.mdx
├── 2024-02-cable-chaos.mdx
└── 2024-03-streaming-dreams.mdx

public/comics/
├── mumo-meets-world/
│   ├── cover.webp (1200x630 for OG)
│   ├── cover-thumb.webp (400x400 for cards)
│   ├── panel-01.webp
│   ├── panel-02.webp
│   └── panel-03.webp
├── cable-chaos/
│   └── ...
└── streaming-dreams/
    └── ...
```

**Naming Conventions:**

- MDX files: `YYYY-MM-slug.mdx` for easy chronological sorting
- Asset directories: Match the slug exactly
- Cover images: `cover.webp` (1200x630), `cover-thumb.webp` (400x400)
- Panel images: `panel-01.webp`, `panel-02.webp`, etc.

## Data Flow

### Home Page Rendering

```
1. Request to / arrives
2. Next.js checks for cached static page (ISR)
3. If stale (>60s), trigger background regeneration:
   a. Call getAllComics() from lib/comics
   b. Sort by publishDate descending
   c. Select first comic as latest
   d. Generate metadata using lib/seo
4. Render LatestIssueHero with latest comic data
5. Render ArchivePreview with top 3 comics
6. Serve static HTML to client
7. Background: Update static cache if regenerated
```

### Comic Detail Page Rendering

```
1. Request to /comics/[slug] arrives
2. Next.js checks for cached static page (ISR)
3. If not cached or stale:
   a. Call getComicBySlug(slug) from lib/comics
   b. Call getAdjacentComics(slug) for navigation
   c. Parse and render MDX content
   d. Generate metadata and JSON-LD schema
4. Serve static HTML with:
   - Rendered MDX content
   - Previous/Next navigation
   - Structured data in <script> tag
5. Client-side: Prefetch adjacent comics on hover
```

### Archive Page Rendering

```
1. Request to /archive?tags=technology arrives
2. Next.js checks for cached static page (ISR)
3. If not cached or stale (>300s):
   a. Call getAllComics() from lib/comics
   b. If tags query param exists, filter comics
   c. Sort according to sortBy param (default: date-desc)
   d. Generate metadata
4. Render ArchiveFilters with all available tags
5. Render ComicCard grid with filtered results
6. Serve static HTML
7. Client-side: Update URL on filter changes (shallow routing)
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Latest comic selection correctness

_For any_ non-empty collection of comics, the latest comic selected should be the one with the most recent publish date, with alphabetical slug ordering as a tiebreaker for identical dates.
**Validates: Requirements 1.3, 1.4**

### Property 2: Comic rendering completeness

_For any_ comic with valid frontmatter, rendering the comic card or hero section should include all required fields: cover image, title, synopsis, publish date, reading time, and tags.
**Validates: Requirements 1.1, 2.2**

### Property 3: Archive chronological ordering

_For any_ collection of comics, displaying them in the archive should result in reverse chronological order (newest first) based on publish date.
**Validates: Requirements 2.1**

### Property 4: Tag filtering correctness

_For any_ tag and any collection of comics, filtering by that tag should return only comics whose tags array includes the selected tag.
**Validates: Requirements 2.3**

### Property 5: Random comic selection validity

_For any_ non-empty collection of comics, selecting a random comic should always return a comic that exists in the original collection.
**Validates: Requirements 2.4**

### Property 6: URL filter synchronization

_For any_ set of active tag filters, the URL query parameters should accurately reflect the selected filters and vice versa.
**Validates: Requirements 2.5**

### Property 7: Comic navigation correctness

_For any_ comic in a chronologically ordered sequence, the previous and next navigation links should point to the correct adjacent comics based on publish date, with null/disabled navigation at sequence boundaries.
**Validates: Requirements 3.3, 3.4, 3.5**

### Property 8: Email validation correctness

_For any_ string input, email validation should accept valid email formats (containing @ and domain) and reject invalid formats.
**Validates: Requirements 4.2**

### Property 9: RSS feed completeness

_For any_ collection of comics, the generated RSS feed should include the 20 most recent comics with all required fields (title, description, publish date, link) and valid XML structure.
**Validates: Requirements 4.3, 4.5**

### Property 10: Frontmatter parsing round-trip

_For any_ valid comic frontmatter, parsing the frontmatter should extract all required fields and validation should accept the parsed data.
**Validates: Requirements 11.3**

### Property 11: Frontmatter validation error clarity

_For any_ invalid frontmatter (missing or malformed fields), validation should throw an error that explicitly identifies which field is problematic.
**Validates: Requirements 11.4**

### Property 12: Data normalization consistency

_For any_ comic data source (file system or future CMS), the lib/comics module should return data structures with identical shapes and field names.
**Validates: Requirements 11.2**

### Property 13: Accessibility attribute completeness

_For any_ interactive element or image, the rendered output should include appropriate accessibility attributes (ARIA labels, roles, alt text).
**Validates: Requirements 7.1, 7.2**

### Property 14: Metadata uniqueness and completeness

_For any_ page route, the generated metadata should include unique title and description tags, canonical URLs, and Open Graph tags.
**Validates: Requirements 8.1, 8.3, 8.5**

### Property 15: Structured data validity

_For any_ comic detail page, the generated JSON-LD should conform to the Article schema and include all required fields (headline, datePublished, author, image).
**Validates: Requirements 8.2**

### Property 16: Sitemap completeness

_For any_ collection of published comics, the generated sitemap should include entries for all comic detail pages with lastmod dates and priority values.
**Validates: Requirements 8.4**

### Property 17: Image dimension attributes

_For any_ rendered image, the HTML should include explicit width and height attributes to prevent layout shifts.
**Validates: Requirements 9.4**

## Error Handling

### Content Parsing Errors

**Invalid Frontmatter:**

- Throw descriptive errors identifying missing or malformed fields
- Include the file path and specific field name in error messages
- Fail fast during build to prevent deploying broken content
- Example: `Error parsing content/comics/example.mdx: Missing required field 'publishDate'`

**MDX Syntax Errors:**

- Catch and report MDX compilation errors with line numbers
- Provide helpful suggestions for common mistakes
- Prevent build completion if any MDX files fail to compile

**Missing Assets:**

- Validate that referenced cover images and panel images exist
- Throw errors during build if assets are missing
- Include file paths in error messages for easy debugging

### Runtime Errors

**Comic Not Found:**

- Return 404 status for invalid comic slugs
- Display user-friendly error page with navigation back to archive
- Log 404s for monitoring potential broken links

**Empty Comic Collection:**

- Handle edge case where no comics are published
- Display appropriate message on home page and archive
- Prevent crashes when attempting to select latest or random comic

**RSS/Sitemap Generation Failures:**

- Log errors but don't fail the build
- Serve cached versions if generation fails
- Alert developers through monitoring

### Validation Errors

**Email Validation:**

- Return clear error messages for invalid email formats
- Validate on both client and server side
- Sanitize inputs to prevent injection attacks

**Tag Filtering:**

- Handle invalid or non-existent tags gracefully
- Return empty results rather than errors
- Sanitize tag inputs to prevent XSS

### Network Errors

**Image Loading Failures:**

- Provide fallback images for failed loads
- Use Next.js Image component error handling
- Log failures for monitoring

**External Service Failures:**

- Implement timeouts for any external API calls
- Provide fallback behavior when services are unavailable
- Cache responses where appropriate

## Testing Strategy

### Unit Testing

**Framework:** Vitest with React Testing Library

**Coverage Areas:**

- **lib/comics.ts:** Test all content retrieval functions with mock file system data
  - getAllComics() returns all comics sorted correctly
  - getComicBySlug() returns correct comic or null
  - getLatestComic() selects most recent comic with tiebreaker
  - getComicsByTag() filters correctly
  - getAllTags() returns unique tags
  - getRandomComic() returns valid comic from collection
  - getAdjacentComics() returns correct previous/next comics

- **lib/mdx.ts:** Test MDX parsing and validation
  - parseMDXFile() extracts frontmatter and content correctly
  - validateFrontmatter() accepts valid data and rejects invalid data
  - Error messages identify specific validation failures

- **lib/seo.ts:** Test metadata generation
  - generateComicMetadata() produces complete Metadata objects
  - generateArticleSchema() produces valid JSON-LD
  - All required fields are present and correctly formatted

- **lib/rss.ts:** Test RSS feed generation
  - generateRSSFeed() produces valid XML
  - Feed includes correct number of items (max 20)
  - All required RSS fields are present
  - XML is properly escaped and encoded

- **Component Unit Tests:** Test individual components in isolation
  - ComicCard renders all required fields
  - LatestIssueHero displays correct data
  - ArchiveFilters updates on interaction
  - SubscribeForm validates email input

**Test Configuration:**

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.config.*', '**/types/**'],
    },
  },
});
```

### Property-Based Testing

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:** Each property test should run a minimum of 100 iterations to ensure comprehensive coverage of the input space.

**Test Tagging:** Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format: `// Feature: mumo-comics, Property {number}: {property_text}`

**Property Test Implementations:**

Each correctness property listed above must be implemented as a single property-based test. The tests should:

1. Generate random but valid input data using fast-check arbitraries
2. Execute the function under test with generated inputs
3. Assert that the correctness property holds for all generated inputs
4. Use smart generators that constrain inputs to valid ranges

**Example Property Test Structure:**

```typescript
// Feature: mumo-comics, Property 1: Latest comic selection correctness
test('latest comic selection is correct', () => {
  fc.assert(
    fc.property(fc.array(comicArbitrary(), { minLength: 1 }), (comics) => {
      const latest = getLatestComic(comics);
      const sorted = [...comics].sort(compareByDateAndSlug);
      expect(latest).toEqual(sorted[0]);
    }),
    { numRuns: 100 }
  );
});
```

**Custom Arbitraries:**

```typescript
// tests/arbitraries.ts
const comicArbitrary = () =>
  fc.record({
    frontmatter: fc.record({
      title: fc.string({ minLength: 1, maxLength: 100 }),
      slug: fc.stringOf(
        fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-')
      ),
      publishDate: fc.date().map((d) => d.toISOString()),
      synopsis: fc.string({ minLength: 10, maxLength: 300 }),
      tags: fc.array(fc.string({ minLength: 2, maxLength: 20 }), {
        minLength: 1,
        maxLength: 5,
      }),
      readingTime: fc.integer({ min: 1, max: 60 }),
      coverImage: fc.constant('/comics/test/cover.webp'),
    }),
    content: fc.string(),
    slug: fc.stringOf(
      fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-')
    ),
  });
```

### Integration Testing

**Framework:** Playwright for end-to-end testing

**Coverage Areas:**

- **Home Page Flow:**
  - Latest issue hero displays correct comic
  - "Start Reading" button navigates to correct comic detail page
  - Archive preview shows recent comics
  - Subscribe section is visible and functional

- **Archive Page Flow:**
  - All comics are displayed in correct order
  - Tag filters update displayed comics
  - URL updates when filters change
  - Random comic button navigates to valid comic

- **Comic Detail Page Flow:**
  - MDX content renders correctly
  - Previous/Next navigation works
  - Navigation is disabled at sequence boundaries
  - Images load with correct optimization

- **Accessibility Testing:**
  - Run @axe-core/playwright on all pages
  - Verify keyboard navigation works
  - Check focus indicators are visible
  - Validate ARIA labels and roles

**Example E2E Test:**

```typescript
// tests/e2e/home.spec.ts
test('Start Reading button links to latest comic', async ({ page }) => {
  await page.goto('/');

  const startReadingButton = page.getByRole('link', { name: /start reading/i });
  await expect(startReadingButton).toBeVisible();

  const href = await startReadingButton.getAttribute('href');
  expect(href).toMatch(/^\/comics\/.+$/);

  await startReadingButton.click();
  await expect(page).toHaveURL(/^\/comics\/.+$/);
});
```

### Visual Regression Testing

**Framework:** Playwright with built-in screenshot comparison (or Percy/Chromatic for advanced features)

**Coverage Areas:**

- LatestIssueHero component across different comic data
- ComicCard component with various content lengths
- Archive page with different filter states
- Mobile, tablet, and desktop layouts

**Configuration:**

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
});
```

### CI/CD Testing Pipeline

**GitHub Actions Workflow:**

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Unit tests
        run: npm run test:unit

      - name: Build
        run: npm run build

      - name: E2E tests
        run: npm run test:e2e

      - name: Lighthouse CI
        run: npm run lighthouse:ci
```

### Performance Testing

**Lighthouse CI:**

- Run Lighthouse audits on every PR
- Enforce performance budgets:
  - Performance score: ≥90
  - Accessibility score: ≥95
  - Best Practices score: ≥90
  - SEO score: ≥95
- Fail builds that don't meet thresholds

**Core Web Vitals Monitoring:**

- Use Vercel Analytics to track real-user metrics
- Set up alerts for degradation in LCP, FID, CLS
- Monitor trends over time

## Performance Optimization

### Static Generation Strategy

**Build-Time Generation:**

- Generate all comic detail pages at build time using `generateStaticParams`
- Pre-render home page and archive page
- Generate sitemap and RSS feed during build

**Incremental Static Regeneration:**

- Home page: revalidate every 60 seconds
- Archive page: revalidate every 300 seconds (5 minutes)
- Comic detail pages: revalidate every 3600 seconds (1 hour)
- On-demand revalidation via webhook when new comics are published

### Image Optimization

**Next.js Image Component:**

- Automatic format optimization (WebP with fallbacks)
- Responsive image sizing with srcset
- Lazy loading for below-the-fold images
- Blur placeholder for better perceived performance

**Build-Time Processing:**

- Compress images using Sharp
- Generate multiple sizes for responsive images
- Convert to WebP format
- Optimize cover images for OG previews (1200x630)

### Code Splitting

**Route-Based Splitting:**

- Automatic code splitting per route with App Router
- Lazy load components not needed for initial render
- Prefetch adjacent comic pages on hover

**Component-Level Splitting:**

```typescript
const SubscribeForm = dynamic(() => import('@/components/forms/SubscribeForm'), {
  loading: () => <SubscribeFormSkeleton />
});
```

### Caching Strategy

**Browser Caching:**

- Static assets: Cache-Control: public, max-age=31536000, immutable
- HTML pages: Cache-Control: public, s-maxage=60, stale-while-revalidate

**CDN Caching:**

- Leverage Vercel Edge Network for global distribution
- Cache static assets at edge locations
- Use stale-while-revalidate for ISR pages

### Bundle Optimization

**Next.js Configuration:**

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};
```

## Deployment Architecture

### Vercel Configuration

**Project Setup:**

- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm ci`
- Node.js Version: 20.x

**Environment Variables:**

- `NEXT_PUBLIC_SITE_URL`: Production domain URL
- `REVALIDATION_TOKEN`: Secret for on-demand revalidation (optional)

**Domain Configuration:**

- Custom domain with HTTPS (automatic via Vercel)
- Redirect www to apex domain (or vice versa)
- Configure DNS records as per Vercel instructions

### Branch Deployment Strategy

**Production Branch:**

- `main` branch deploys to production domain
- Automatic deployment on merge
- Run full test suite before deployment

**Preview Branches:**

- All PRs get unique preview URLs
- Preview deployments include all features
- Automatic comments on PRs with preview URL

### Post-Deployment Automation

**Sitemap & RSS Regeneration:**

- Automatically regenerated during build
- Accessible at `/sitemap.xml` and `/api/rss`

**Search Engine Notification:**

- Optional: Ping Google/Bing with new sitemap URL
- Can be triggered via GitHub Action after deployment

**Monitoring & Alerts:**

- Vercel Analytics for Core Web Vitals
- Error tracking via Vercel Logs
- Optional: Integrate Sentry for detailed error tracking

## Content Workflow

### Creating New Comics

**Step 1: Run Comic Scaffold Script**

```bash
npm run new:comic
```

The script prompts for:

- Title
- Slug (auto-generated from title, editable)
- Publish date (defaults to today)
- Synopsis
- Tags (comma-separated)
- Reading time estimate
- Author name

**Step 2: Add Comic Assets**

- Place cover image in `public/comics/[slug]/cover.jpg`
- Place panel images in `public/comics/[slug]/panel-01.jpg`, etc.
- Run `npm run optimize:images` to compress and convert to WebP

**Step 3: Write Comic Content**

- Edit the generated MDX file in `content/comics/`
- Use MDX components for panels, speech bubbles, etc.
- Preview locally with `npm run dev`

**Step 4: Create Pull Request**

- Create feature branch: `git checkout -b comic/[slug]`
- Commit changes: `git add . && git commit -m "Add comic: [title]"`
- Push and open PR: `git push origin comic/[slug]`

**Step 5: Review & Merge**

- CI runs automatically (lint, test, build)
- Preview deployment URL posted in PR comments
- Request review from team member
- Merge to main after approval

**Step 6: Automatic Deployment**

- Merge triggers production deployment
- Sitemap and RSS feed regenerated
- New comic appears on site within revalidation period

### Content Validation

**Pre-Commit Checks:**

```json
// package.json
{
  "lint-staged": {
    "content/comics/*.mdx": ["npm run validate:content", "npm run lint:mdx"]
  }
}
```

**Validation Script:**

- Check all required frontmatter fields present
- Validate date formats
- Verify referenced images exist
- Check slug uniqueness
- Validate tag format

### Editorial Guidelines

**Documented in CONTRIBUTING.md:**

- MDX frontmatter schema with examples
- Image specifications (dimensions, formats, file sizes)
- Naming conventions for files and slugs
- Tag taxonomy and guidelines
- Writing style guide for synopses
- Accessibility requirements for alt text

## Future Enhancements

### CMS Integration

**Decap CMS (formerly Netlify CMS) Integration:**

- Add `admin/config.yml` for CMS configuration
- Configure collections for comics
- Map frontmatter fields to CMS widgets
- Enable editorial workflow (draft/review/ready)

**Content API Abstraction:**

- Modify `lib/comics.ts` to support multiple sources
- Add environment variable to switch between file system and CMS
- Implement CMS-specific data fetching
- Maintain same data structure for application code

### Webhook Automation

**On-Demand Revalidation:**

```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const token = request.headers.get('authorization');
  if (token !== process.env.REVALIDATION_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  revalidatePath('/');
  revalidatePath('/archive');
  revalidateTag('comics');

  return Response.json({ revalidated: true });
}
```

**Social Media Auto-Posting:**

- Trigger on new comic publication
- Post to Twitter/X with cover image and link
- Post to Instagram with cover image
- Post to Facebook page

**Email Notifications:**

- Integrate with email service (SendGrid, Mailchimp)
- Send notification to subscribers when new comic published
- Include cover image and "Read Now" link

### Analytics & Insights

**Reader Engagement:**

- Track most popular comics
- Monitor reading time vs. estimated time
- Analyze tag popularity
- Track referral sources

**A/B Testing:**

- Test different hero layouts
- Experiment with CTA button text
- Optimize archive page layouts

### Community Features

**Comments System:**

- Integrate Disqus or similar
- Allow readers to discuss comics
- Moderate comments

**Reader Submissions:**

- Form for readers to submit comic ideas
- Gallery of fan art
- Community voting on favorite comics

### Internationalization

**Multi-Language Support:**

- Add i18n configuration
- Translate UI strings
- Support multiple language versions of comics
- Language switcher in navigation
