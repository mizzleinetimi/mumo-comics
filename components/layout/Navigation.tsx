'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Navigation links configuration
 */
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/archive', label: 'Archive' },
  { href: '/api/rss', label: 'RSS', external: true },
];

/**
 * Navigation component with responsive mobile menu
 * Includes hamburger menu for mobile devices
 *
 * Requirements: 14.5
 */
export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="flex items-center" aria-label="Main navigation">
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:space-x-8">
        {NAV_LINKS.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-mumo-orange font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-mumo-orange border-b-2 border-mumo-orange'
                  : 'text-gray-700 hover:text-mumo-orange'
              }`}
            >
              {link.label}
            </Link>
          )
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-mumo-orange hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mumo-orange transition-colors"
        aria-expanded={mobileMenuOpen}
        aria-label="Toggle navigation menu"
        onClick={toggleMobileMenu}
      >
        <span className="sr-only">Open main menu</span>
        {/* Hamburger Icon */}
        {!mobileMenuOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          /* Close Icon */
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mumo-orange hover:bg-gray-50 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-mumo-orange bg-orange-50'
                      : 'text-gray-700 hover:text-mumo-orange hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
