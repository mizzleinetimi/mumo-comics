import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from './Navigation';

/**
 * Header component with Mumo branding and navigation
 * Includes logo, site title, and responsive navigation
 *
 * Requirements: 14.5
 */
export function Header() {
  return (
    <header className="bg-white border-b-3 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Site Title */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 group"
              aria-label="Mumo Comics home"
            >
              {/* Logo/Icon */}
              <div className="w-12 h-12 bg-mumo-orange border-3 border-black rounded-full flex items-center justify-center font-heading font-bold text-white text-2xl shadow-hard group-hover:shadow-hard-lg group-hover:-translate-y-1 transition-all">
                M
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-black group-hover:text-mumo-orange transition-colors">
                  Mumo Comics
                </h1>
                <div className="text-xs font-bold text-gray-500 hidden sm:flex items-center gap-1 uppercase tracking-wider">
                  Weekly Comics
                  <Image
                    src="/images/yam.svg"
                    alt="Yam"
                    width={20}
                    height={20}
                    className="inline-block -mt-1"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </header>
  );
}
