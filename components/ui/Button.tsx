import React from 'react';
import Link from 'next/link';

/**
 * Button variants for different visual styles
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline';

/**
 * Button sizes
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Base button props
 */
interface BaseButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Props for button element
 */
interface ButtonElementProps extends BaseButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Props for link button
 */
interface LinkButtonProps extends BaseButtonProps {
  href: string;
  external?: boolean;
}

/**
 * Combined button props
 */
type ButtonProps = ButtonElementProps | LinkButtonProps;

/**
 * Type guard to check if props include href (link button)
 */
function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return 'href' in props;
}

/**
 * Get variant-specific styles
 */
function getVariantStyles(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return 'bg-mumo-orange text-white hover:bg-white hover:text-mumo-orange';
    case 'secondary':
      return 'bg-mumo-yellow text-black hover:bg-white';
    case 'outline':
      return 'bg-white text-black hover:bg-mumo-blue hover:text-white';
    default:
      return '';
  }
}

/**
 * Get size-specific styles
 */
function getSizeStyles(size: ButtonSize): string {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'md':
      return 'px-4 py-2 text-base';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return '';
  }
}

/**
 * Button component with Mumo branding
 * Supports both button and link variants with proper accessibility
 *
 * @example
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>Click me</Button>
 *
 * @example
 * // Link button
 * <Button href="/comics/slug" variant="secondary">Read Comic</Button>
 *
 * Requirements: 7.1, 7.3, 14.1, 14.2, 14.3
 */
export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ariaLabel,
  } = props;

  // Base styles shared by all buttons
  const baseStyles = `
    inline-flex items-center justify-center
    font-heading font-bold rounded-xl
    border-3 border-black
    shadow-hard hover:shadow-hard-lg active:shadow-none
    active:translate-x-[4px] active:translate-y-[4px]
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-[2px] disabled:translate-y-[2px]
    ${getVariantStyles(variant)}
    ${getSizeStyles(size)}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  // Render as link if href is provided
  if (isLinkButton(props)) {
    const { href, external = false } = props;

    if (external) {
      return (
        <a
          href={href}
          className={baseStyles}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={baseStyles} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  // Render as button element
  const { type = 'button', onClick } = props;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
