import React from 'react';

/**
 * Card component props
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Get padding styles
 */
function getPaddingStyles(padding: CardProps['padding']): string {
  switch (padding) {
    case 'none':
      return '';
    case 'sm':
      return 'p-3';
    case 'md':
      return 'p-4';
    case 'lg':
      return 'p-6';
    default:
      return 'p-4';
  }
}

/**
 * Card component for displaying content in a contained box
 * Used for comic cards and other content containers
 *
 * @example
 * <Card hover>
 *   <h3>Comic Title</h3>
 *   <p>Synopsis...</p>
 * </Card>
 *
 * Requirements: 14.1, 14.2, 14.3
 */
export function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  const baseStyles = `
    bg-white rounded-lg shadow-md
    ${getPaddingStyles(padding)}
    ${hover ? 'transition-transform duration-200 hover:scale-105 hover:shadow-lg' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return <div className={baseStyles}>{children}</div>;
}

/**
 * Card header component for consistent card headers
 */
export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

/**
 * Card content component for main card content
 */
export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

/**
 * Card footer component for card actions or metadata
 */
export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mt-3 ${className}`}>{children}</div>;
}
