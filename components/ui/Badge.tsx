import React from 'react';

/**
 * Badge variants for different visual styles
 */
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline';

/**
 * Badge sizes
 */
type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge component props
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  active?: boolean;
}

/**
 * Get variant-specific styles
 */
function getVariantStyles(variant: BadgeVariant, active: boolean): string {
  if (active) {
    return 'bg-mumo-orange text-white border-mumo-orange';
  }

  switch (variant) {
    case 'primary':
      return 'bg-mumo-orange text-white';
    case 'secondary':
      return 'bg-mumo-yellow text-gray-900';
    case 'outline':
      return 'bg-transparent border border-mumo-orange text-mumo-orange';
    case 'default':
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

/**
 * Get size-specific styles
 */
function getSizeStyles(size: BadgeSize): string {
  switch (size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs';
    case 'md':
      return 'px-2.5 py-1 text-sm';
    case 'lg':
      return 'px-3 py-1.5 text-base';
    default:
      return '';
  }
}

/**
 * Badge component for displaying tags and labels
 * Used for comic tags and other categorical information
 *
 * @example
 * // Static badge
 * <Badge variant="primary">Technology</Badge>
 *
 * @example
 * // Interactive badge (for filters)
 * <Badge
 *   variant="outline"
 *   onClick={handleClick}
 *   active={isActive}
 *   ariaLabel="Filter by technology"
 * >
 *   Technology
 * </Badge>
 *
 * Requirements: 7.1, 7.3, 14.1, 14.2, 14.3
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  ariaLabel,
  active = false,
}: BadgeProps) {
  const isInteractive = !!onClick;

  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold rounded-full
    ${getVariantStyles(variant, active)}
    ${getSizeStyles(size)}
    ${isInteractive ? 'cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mumo-orange focus:ring-offset-2' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={baseStyles}
        aria-label={ariaLabel}
        aria-pressed={active}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={baseStyles} aria-label={ariaLabel}>
      {children}
    </span>
  );
}

/**
 * Badge group component for displaying multiple badges
 */
export function BadgeGroup({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex flex-wrap gap-2 ${className}`}>{children}</div>;
}
