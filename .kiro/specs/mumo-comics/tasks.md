# Implementation Plan

- [x] 1. Initialize Next.js project with TypeScript and core dependencies
  - Create Next.js 14 project with App Router and TypeScript
  - Install and configure Tailwind CSS with custom Mumo branding colors (orange/yellow palette)
  - Set up ESLint, Prettier, and git hooks with Husky and lint-staged
  - Configure TypeScript with strict mode
  - Create basic directory structure (app, components, lib, types, content, public)
  - Configure Next.js with image optimization settings
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Define core data types and validation schemas
  - Create TypeScript interfaces for Comic, ComicFrontmatter, and related types in `types/comic.ts`
  - Implement Zod schemas for frontmatter validation in `lib/schema.ts`
  - Add validation for all required fields (title, slug, publishDate, synopsis, tags, readingTime, coverImage)
  - _Requirements: 5.1, 11.3_

- [ ]\* 2.1 Write property test for frontmatter validation
  - **Property 10: Frontmatter parsing round-trip**
  - **Validates: Requirements 11.3**

- [ ]\* 2.2 Write property test for validation error messages
  - **Property 11: Frontmatter validation error clarity**
  - **Validates: Requirements 11.4**

- [x] 3. Implement content layer and MDX processing
  - Install MDX dependencies (gray-matter, next-mdx-remote)
  - Create `lib/mdx.ts` with functions to parse MDX files and extract frontmatter
  - Implement `parseMDXFile()` to read and parse MDX content
  - Implement `validateFrontmatter()` using Zod schemas
  - Add error handling for invalid frontmatter with descriptive messages
  - Implement helper functions: `getMDXFiles()` and `extractSlugFromFilename()`
  - _Requirements: 5.1, 11.3, 11.4_

- [ ]\* 3.1 Write unit tests for MDX parsing functions
  - Test parseMDXFile() with valid and invalid MDX
  - Test validateFrontmatter() accepts valid data and rejects invalid data
  - Test error messages identify specific validation failures
  - _Requirements: 11.3, 11.4_

- [ ] 4. Implement core content API (lib/comics.ts)
  - Create `lib/comics.ts` as abstraction layer for content sourcing
  - Implement `getAllComics()` to read all MDX files from content/comics/
  - Implement `getComicBySlug()` to retrieve specific comic
  - Implement `getLatestComic()` with date sorting and slug tiebreaker
  - Implement `getComicsByTag()` for tag filtering
  - Implement `getAllTags()` to extract unique tags
  - Implement `getRandomComic()` for random selection
  - Implement `getAdjacentComics()` for previous/next navigation
  - Add React cache() for request deduplication
  - _Requirements: 1.3, 1.4, 2.1, 2.3, 2.4, 3.3, 11.1, 11.2_

- [ ]\* 4.1 Write property test for latest comic selection
  - **Property 1: Latest comic selection correctness**
  - **Validates: Requirements 1.3, 1.4**

- [ ]\* 4.2 Write property test for tag filtering
  - **Property 4: Tag filtering correctness**
  - **Validates: Requirements 2.3**

- [ ]\* 4.3 Write property test for random comic selection
  - **Property 5: Random comic selection validity**
  - **Validates: Requirements 2.4**

- [ ]\* 4.4 Write property test for comic navigation
  - **Property 7: Comic navigation correctness**
  - **Validates: Requirements 3.3, 3.4, 3.5**

- [ ]\* 4.5 Write property test for data normalization
  - **Property 12: Data normalization consistency**
  - **Validates: Requirements 11.2**

- [ ]\* 4.6 Write unit tests for content API functions
  - Test getAllComics() returns all comics sorted correctly
  - Test getComicBySlug() returns correct comic or null
  - Test getAllTags() returns unique tags
  - Test getAdjacentComics() handles edge cases (first/last comic)
  - _Requirements: 1.3, 2.1, 2.3, 3.3_

- [ ] 5. Create additional sample comic content
  - Create 2 more sample MDX comics with complete frontmatter (total of 3)
  - Create corresponding asset directories in `public/comics/[slug]/`
  - Add placeholder cover images and comic panels
  - Ensure variety in tags, dates, and content for testing
  - _Requirements: 5.1_

- [ ] 6. Implement SEO utilities and metadata generation
  - Create `lib/seo.ts` for SEO-related functions
  - Implement `generateComicMetadata()` to create Next.js Metadata objects
  - Implement `generateArticleSchema()` for JSON-LD structured data
  - Implement `generateBreadcrumbSchema()` for breadcrumb navigation
  - Ensure unique titles, descriptions, and canonical URLs for each page
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]\* 6.1 Write property test for metadata completeness
  - **Property 14: Metadata uniqueness and completeness**
  - **Validates: Requirements 8.1, 8.3, 8.5**

- [ ]\* 6.2 Write property test for structured data validity
  - **Property 15: Structured data validity**
  - **Validates: Requirements 8.2**

- [ ]\* 6.3 Write unit tests for SEO utilities
  - Test generateComicMetadata() produces complete Metadata objects
  - Test generateArticleSchema() produces valid JSON-LD
  - Test all required fields are present and correctly formatted
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 7. Implement RSS feed generation
  - Create `lib/rss.ts` for RSS feed utilities
  - Implement `generateRSSFeed()` to create XML feed from comics
  - Implement `generateRSSItem()` for individual feed items
  - Ensure proper XML escaping and encoding
  - Limit feed to 20 most recent comics
  - Create API route at `app/api/rss/route.ts` to serve RSS feed
  - _Requirements: 4.3, 4.5_

- [ ]\* 7.1 Write property test for RSS feed completeness
  - **Property 9: RSS feed completeness**
  - **Validates: Requirements 4.3, 4.5**

- [ ]\* 7.2 Write unit tests for RSS generation
  - Test generateRSSFeed() produces valid XML
  - Test feed includes correct number of items (max 20)
  - Test all required RSS fields are present
  - Test XML is properly escaped and encoded
  - _Requirements: 4.3, 4.5_

- [x] 8. Implement dynamic sitemap generation
  - Create `app/sitemap.ts` for dynamic sitemap
  - Generate sitemap entries for all comic pages
  - Include home page, archive page, and all comic detail pages
  - Add lastmod dates based on publishDate
  - Set appropriate priority values
  - _Requirements: 8.4_

- [ ]\* 8.1 Write property test for sitemap completeness
  - **Property 16: Sitemap completeness**
  - **Validates: Requirements 8.4**

- [ ] 9. Create base UI components
  - Create `components/ui/Button.tsx` with Mumo branding styles
  - Create `components/ui/Card.tsx` for comic cards
  - Create `components/ui/Badge.tsx` for tags
  - Implement responsive styles using Tailwind
  - Ensure all components have proper ARIA labels and keyboard navigation
  - Add focus indicators for accessibility
  - _Requirements: 7.1, 7.3, 14.1, 14.2, 14.3_

- [ ]\* 9.1 Write property test for accessibility attributes
  - **Property 13: Accessibility attribute completeness**
  - **Validates: Requirements 7.1, 7.2**

- [x] 10. Implement layout components
  - Create `components/layout/Header.tsx` with Mumo branding
  - Create `components/layout/Footer.tsx` with links and copyright
  - Create `components/layout/Navigation.tsx` with responsive mobile menu
  - Implement hamburger menu for mobile devices
  - Add proper semantic HTML (header, nav, main, footer)
  - Ensure keyboard navigation works correctly
  - _Requirements: 14.5_

- [x] 11. Update root layout with proper structure
  - Update `app/layout.tsx` with Header and Footer components
  - Configure global metadata (site title, description, OG defaults)
  - Ensure proper semantic HTML structure
  - Configure Next.js metadata API for SEO
  - _Requirements: 8.1_

- [x] 12. Implement ComicCard component
  - Create `components/comics/ComicCard.tsx`
  - Display cover image, title, synopsis, publish date, reading time, and tags
  - Use Next.js Image component for optimization
  - Implement responsive layout (full width on mobile, grid on tablet/desktop)
  - Add hover effects and animations
  - Ensure all images have alt text
  - _Requirements: 1.1, 2.2, 7.2, 14.1, 14.2, 14.3_

- [ ]\* 12.1 Write property test for comic rendering completeness
  - **Property 2: Comic rendering completeness**
  - **Validates: Requirements 1.1, 2.2**

- [ ]\* 12.2 Write property test for image dimension attributes
  - **Property 17: Image dimension attributes**
  - **Validates: Requirements 9.4**

- [x] 13. Implement LatestIssueHero component
  - Create `components/home/LatestIssueHero.tsx`
  - Display latest comic with large cover image, title, synopsis, and metadata
  - Add prominent "Start Reading" button linking to `/comics/[slug]`
  - Implement responsive layout (stacked on mobile, side-by-side on desktop)
  - Use Mumo branding colors for visual appeal
  - Ensure button has proper ARIA label
  - _Requirements: 1.1, 1.2, 7.1_

- [x] 14. Implement home page
  - Update `app/page.tsx` for home page
  - Call `getLatestComic()` to fetch latest comic data
  - Render LatestIssueHero with latest comic
  - Add intro section about Mumo with character artwork
  - Render archive preview with top 3 recent comics using ComicCard
  - Add subscribe section placeholder
  - Configure ISR with 60-second revalidation
  - Generate metadata using SEO utilities
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 10.3_

- [ ]\* 14.1 Write Playwright test for home page
  - Test latest issue hero displays correct comic
  - Test "Start Reading" button links to correct comic detail page
  - Test archive preview shows recent comics
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Implement MDXRenderer component
  - Create `components/comics/MDXRenderer.tsx`
  - Configure MDX components for rendering comic content
  - Style comic panels, text, and speech bubbles
  - Implement lazy loading for images below the fold
  - Ensure responsive image sizing for mobile
  - Add proper semantic HTML structure
  - _Requirements: 3.1, 3.6, 14.4_

- [x] 17. Implement ComicNavigation component
  - Create `components/comics/ComicNavigation.tsx`
  - Display previous and next comic links with titles
  - Disable/hide navigation at sequence boundaries
  - Add keyboard shortcuts (arrow keys) for navigation
  - Implement prefetching on hover for better performance
  - Style with Mumo branding
  - _Requirements: 3.3, 3.4, 3.5_

- [x] 18. Implement comic detail page
  - Create `app/comics/[slug]/page.tsx`
  - Implement `generateStaticParams()` to pre-render all comic pages
  - Call `getComicBySlug()` and `getAdjacentComics()` to fetch data
  - Render MDXRenderer with comic content
  - Render ComicNavigation with previous/next links
  - Generate metadata with comic-specific title, description, and OG image
  - Add JSON-LD structured data using Article schema
  - Configure ISR with 3600-second revalidation
  - Handle 404 for invalid slugs
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.2, 8.3, 10.1_

- [ ]\* 18.1 Write Playwright test for comic detail page
  - Test MDX content renders correctly
  - Test previous/next navigation works
  - Test navigation is disabled at boundaries
  - _Requirements: 3.1, 3.3, 3.4, 3.5_

- [x] 19. Implement ArchiveFilters component
  - Create `components/archive/ArchiveFilters.tsx`
  - Display all available tags as filter pills/buttons
  - Highlight active filters
  - Update URL query parameters when filters change
  - Support multiple tag selection
  - Add "Clear Filters" button
  - Ensure keyboard navigation and ARIA labels
  - _Requirements: 2.3, 2.5, 7.1_

- [ ]\* 19.1 Write property test for URL filter synchronization
  - **Property 6: URL filter synchronization**
  - **Validates: Requirements 2.5**

- [x] 20. Implement RandomComicButton component
  - Create `components/archive/RandomComicButton.tsx`
  - Implement client-side random selection from available comics
  - Navigate to randomly selected comic on click
  - Style as prominent CTA button
  - Add fun animation or icon
  - Ensure proper ARIA label
  - _Requirements: 2.4, 7.1_

- [x] 21. Implement archive page
  - Create `app/archive/page.tsx`
  - Call `getAllComics()` to fetch all comics
  - Implement tag filtering based on URL query parameters
  - Sort comics in reverse chronological order
  - Render ArchiveFilters with all available tags
  - Render ComicCard grid with filtered results
  - Render RandomComicButton
  - Implement responsive grid (1 column mobile, 2 tablet, 3 desktop)
  - Configure ISR with 300-second revalidation
  - Generate metadata for archive page
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.4, 14.1, 14.2, 14.3_

- [ ]\* 21.1 Write property test for archive chronological ordering
  - **Property 3: Archive chronological ordering**
  - **Validates: Requirements 2.1**

- [ ]\* 21.2 Write Playwright test for archive page
  - Test all comics are displayed in correct order
  - Test tag filters update displayed comics
  - Test URL updates when filters change
  - Test random comic button navigates to valid comic
  - _Requirements: 2.1, 2.3, 2.5, 2.4_

- [ ] 22. Implement SubscribeForm component
  - Create `components/forms/SubscribeForm.tsx`
  - Add email input field with validation
  - Implement client-side email format validation
  - Display validation errors clearly
  - Add submit button with loading state
  - Implement form submission (placeholder for now, can integrate email service later)
  - Ensure form is keyboard accessible
  - Add proper ARIA labels and error announcements
  - _Requirements: 4.1, 4.2, 7.1_

- [ ]\* 22.1 Write property test for email validation
  - **Property 8: Email validation correctness**
  - **Validates: Requirements 4.2**

- [ ] 23. Implement SubscribeSection component
  - Create `components/home/SubscribeSection.tsx`
  - Display both email subscription and RSS feed options
  - Render SubscribeForm for email subscription
  - Add RSS feed link with icon
  - Style with Mumo branding
  - Add engaging copy encouraging subscriptions
  - _Requirements: 4.1_

- [ ] 24. Add subscribe section to home page
  - Import and render SubscribeSection in home page
  - Position below archive preview
  - Ensure responsive layout
  - _Requirements: 4.1_

- [ ] 25. Implement dynamic OG image generation
  - Install @vercel/og package
  - Create `app/api/og/[slug]/route.ts` using @vercel/og
  - Generate dynamic OG images with comic title and cover
  - Use Mumo branding colors and fonts
  - Set proper dimensions (1200x630)
  - Cache generated images
  - Update metadata generation to use dynamic OG images
  - _Requirements: 8.5_

- [x] 26. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 27. Create image optimization script
  - Install Sharp package
  - Create `scripts/optimize-images.ts`
  - Implement batch image compression using Sharp
  - Generate WebP versions of all images
  - Create multiple sizes for responsive images (cover, thumbnail, panels)
  - Optimize cover images for OG previews (1200x630)
  - Add CLI interface with progress indicators
  - _Requirements: 5.5_

- [ ] 28. Create new comic scaffolding script
  - Create `scripts/new-comic.ts`
  - Implement interactive CLI prompts for metadata (title, slug, date, synopsis, tags, reading time, author)
  - Auto-generate slug from title with option to edit
  - Validate all inputs according to schema
  - Create MDX file with formatted frontmatter and content template
  - Create asset directory in `public/comics/[slug]/`
  - Add helpful instructions for next steps
  - _Requirements: 5.2, 5.3_

- [ ]\* 28.1 Write unit tests for new comic script
  - Test script prompts for all required fields
  - Test script validates inputs correctly
  - Test script creates MDX file with proper structure
  - _Requirements: 5.2, 5.3_

- [ ] 29. Create content validation script
  - Create `scripts/validate-content.ts`
  - Check all MDX files have valid frontmatter
  - Verify all required fields are present
  - Validate date formats and slug uniqueness
  - Check that referenced images exist
  - Report all validation errors with file paths
  - Exit with error code if validation fails
  - _Requirements: 11.3, 11.4_

- [ ] 30. Configure testing infrastructure
  - Install and configure Vitest for unit tests
  - Install and configure Playwright for E2E tests
  - Install @axe-core/playwright for accessibility testing
  - Install fast-check for property-based testing
  - Create test setup files and utilities
  - Create custom arbitraries for property tests (comicArbitrary, etc.)
  - Configure test coverage reporting
  - Add test scripts to package.json
  - _Requirements: 12.1, 12.2_

- [ ] 31. Set up fast-check arbitraries for property testing
  - Create `tests/arbitraries.ts` with custom generators
  - Implement comicArbitrary() for generating random valid comics
  - Implement frontmatterArbitrary() for generating random frontmatter
  - Implement tagArbitrary() for generating valid tags
  - Implement dateArbitrary() for generating valid ISO dates
  - Ensure generators produce valid data within schema constraints
  - _Requirements: 12.1_

- [ ] 32. Implement accessibility testing
  - Create Playwright test that runs axe on all major pages
  - Test home page, archive page, and comic detail page
  - Verify no WCAG AA violations
  - Test keyboard navigation on all interactive elements
  - Verify focus indicators are visible
  - Test with screen reader (manual or automated)
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ]\* 32.1 Write Playwright accessibility tests
  - Run @axe-core/playwright on home page
  - Run @axe-core/playwright on archive page
  - Run @axe-core/playwright on comic detail page
  - Test keyboard navigation works on all pages
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 33. Implement responsive design testing
  - Create Playwright tests for different viewport sizes
  - Test mobile layout (320px-767px): single column, hamburger menu
  - Test tablet layout (768px-1023px): two-column grid
  - Test desktop layout (1024px+): three-column grid
  - Verify images scale correctly on mobile without horizontal scroll
  - Test touch targets are appropriately sized on mobile
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ]\* 33.1 Write Playwright responsive design tests
  - Test mobile layout displays correctly
  - Test tablet layout displays correctly
  - Test desktop layout displays correctly
  - Test images scale appropriately on mobile
  - Test mobile navigation menu works
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 34. Set up GitHub Actions CI workflow
  - Create `.github/workflows/ci.yml`
  - Configure workflow to run on push and pull requests
  - Add steps for: install dependencies, lint, type check, unit tests, build, E2E tests
  - Configure Playwright to run in CI environment
  - Add test result reporting
  - Configure workflow to fail on any errors
  - _Requirements: 6.2_

- [ ] 35. Configure Lighthouse CI
  - Install and configure Lighthouse CI
  - Create `lighthouserc.json` with performance budgets
  - Set thresholds: Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥95
  - Add Lighthouse CI step to GitHub Actions workflow
  - Configure to fail builds that don't meet thresholds
  - _Requirements: 9.5_

- [ ] 36. Create GitHub issue templates
  - Create `.github/ISSUE_TEMPLATE/new-comic.md` for comic submissions
  - Create `.github/ISSUE_TEMPLATE/bug-report.md` for bugs
  - Create `.github/ISSUE_TEMPLATE/feature-request.md` for enhancements
  - Include all relevant fields and instructions
  - _Requirements: 6.1_

- [ ] 37. Create pull request template
  - Create `.github/pull_request_template.md`
  - Include checklist for: tests added, lint passing, preview reviewed
  - Add sections for description, changes, and screenshots
  - Include link to related issue
  - _Requirements: 6.4_

- [ ] 38. Configure Vercel deployment
  - Connect GitHub repository to Vercel
  - Configure build settings (framework: Next.js, build command, output directory)
  - Set up custom domain and HTTPS
  - Configure environment variables if needed
  - Enable Vercel Analytics for Core Web Vitals monitoring
  - Set up preview deployments for all PRs
  - Configure branch protection rules on GitHub
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 39. Create CONTRIBUTING.md documentation
  - Document MDX frontmatter schema with examples
  - Explain image specifications (dimensions, formats, file sizes)
  - Document naming conventions for files and slugs
  - Provide tag taxonomy and guidelines
  - Include writing style guide for synopses
  - Document accessibility requirements for alt text
  - Explain branch naming conventions
  - Document PR review process
  - Include instructions for running scripts (new:comic, optimize:images)
  - _Requirements: 6.1, 6.4_

- [ ] 40. Update README.md with comprehensive documentation
  - Add project overview and features
  - Include setup instructions (clone, install, run dev server)
  - Document available scripts (dev, build, test, new:comic, etc.)
  - Explain project structure and architecture
  - Add deployment instructions
  - Include links to CONTRIBUTING.md
  - Add screenshots of the site
  - Include Mumo branding and character description
  - _Requirements: All requirements_

- [ ] 41. Add robots.txt configuration
  - Create `app/robots.ts` for dynamic robots.txt
  - Allow all crawlers
  - Include sitemap URL
  - _Requirements: 8.4_

- [ ] 42. Implement error pages
  - Create `app/not-found.tsx` for 404 errors
  - Create `app/error.tsx` for runtime errors
  - Style error pages with Mumo branding
  - Include navigation back to home or archive
  - Add helpful error messages
  - Ensure error pages are accessible
  - _Requirements: Error handling for invalid comic slugs_

- [ ] 43. Add loading states and skeletons
  - Create loading.tsx files for route segments
  - Implement skeleton components for ComicCard, LatestIssueHero
  - Add loading states to SubscribeForm
  - Ensure loading states are accessible (ARIA live regions)
  - _Requirements: User experience enhancement_

- [ ] 44. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 45. Create sample comics with full content
  - Replace placeholder comics with 3 complete sample comics
  - Write engaging stories featuring Mumo
  - Create or source comic panel images
  - Optimize all images using the optimize-images script
  - Ensure variety in tags, reading times, and themes
  - Add descriptive alt text to all images
  - _Requirements: 5.1, 7.2_

- [ ] 46. Perform final accessibility audit
  - Run manual accessibility testing with screen reader
  - Test keyboard navigation on all pages
  - Verify color contrast meets WCAG AA standards
  - Check all images have descriptive alt text
  - Verify all interactive elements have ARIA labels
  - Test with browser accessibility tools
  - Fix any issues found
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 47. Perform final performance audit
  - Run Lighthouse on all major pages
  - Verify Core Web Vitals meet thresholds (LCP <2.5s, FID <100ms, CLS <0.1)
  - Check image optimization is working correctly
  - Verify ISR is configured correctly
  - Test page load times on slow connections
  - Optimize any performance bottlenecks
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 48. Deploy to production
  - Merge all changes to main branch
  - Verify automatic deployment to Vercel
  - Test production site thoroughly
  - Verify sitemap and RSS feed are accessible
  - Test OG images are generating correctly
  - Verify custom domain and HTTPS are working
  - Check Vercel Analytics is collecting data
  - _Requirements: 13.1, 13.4, 13.5_

- [ ] 49. Post-deployment verification
  - Submit sitemap to Google Search Console
  - Test RSS feed in feed readers
  - Verify social media previews (Twitter, Facebook, LinkedIn)
  - Test all major user flows (home → comic, archive → filter → comic)
  - Monitor for any errors in Vercel logs
  - Verify Core Web Vitals in Vercel Analytics
  - _Requirements: 8.4, 8.5_
