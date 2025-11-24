import type { Metadata } from 'next';
import { Fredoka, Balsamiq_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const balsamiq = Balsamiq_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-balsamiq',
  display: 'swap',
});

/**
 * Root layout metadata
 * Provides default metadata for the entire site
 * Individual pages can override these values
 *
 * Requirements: 8.1
 */
export const metadata: Metadata = {
  title: {
    default: 'Mumo Comics - Weekly Comics About Technology and Streaming',
    template: '%s | Mumo Comics',
  },
  description:
    'Weekly short comics featuring the character Mumo exploring technology, streaming, and modern life.',
  keywords: ['comics', 'webcomics', 'mumo', 'streaming', 'technology', 'humor'],
  authors: [{ name: 'Mumo Comics Team' }],
  creator: 'Mumo Comics Team',
  publisher: 'Mumo Comics',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Mumo Comics',
    title: 'Mumo Comics - Weekly Comics About Technology and Streaming',
    description:
      'Weekly short comics featuring the character Mumo exploring technology, streaming, and modern life.',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    creator: '@mumocomics',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add your verification codes here)
  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

/**
 * Root layout component
 * Wraps all pages with Header and Footer
 * Provides consistent structure and styling across the site
 *
 * Requirements: 8.1
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${balsamiq.variable}`}>
      <body className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
