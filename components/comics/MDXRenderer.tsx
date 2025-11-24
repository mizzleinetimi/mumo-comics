import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

/**
 * Custom MDX components for rendering comic content
 * Provides styled versions of standard HTML elements
 */
const components = {
  // Headings
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-6" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-4" {...props} />
  ),

  // Paragraphs
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-lg text-gray-700 mb-4 leading-relaxed" {...props} />
  ),

  // Images - with Next.js Image optimization
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt = '' } = props;
    if (!src) return null;

    return (
      <div className="my-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    );
  },

  // Strong/Bold
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-mumo-orange" {...props} />
  ),

  // Emphasis/Italic
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-gray-800" {...props} />
  ),

  // Links
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-mumo-blue hover:text-mumo-orange underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),

  // Lists
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="text-lg text-gray-700" {...props} />
  ),

  // Blockquote
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-mumo-orange pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r"
      {...props}
    />
  ),

  // Code
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-gray-100 text-mumo-orange px-2 py-1 rounded text-sm font-mono"
      {...props}
    />
  ),

  // Horizontal Rule
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-t-2 border-gray-200" {...props} />
  ),
};

/**
 * MDXRenderer component props
 */
interface MDXRendererProps {
  content: string;
}

/**
 * MDXRenderer component for rendering comic MDX content
 *
 * Features:
 * - Custom styled components for all MDX elements
 * - Next.js Image optimization for comic panels
 * - Lazy loading for images below the fold
 * - Responsive image sizing
 * - Semantic HTML structure
 *
 * @example
 * <MDXRenderer content={comic.content} />
 *
 * Requirements: 3.1, 3.6, 14.4
 */
export async function MDXRenderer({ content }: MDXRendererProps) {
  return (
    <article className="prose prose-lg max-w-none">
      <MDXRemote source={content} components={components} />
    </article>
  );
}
