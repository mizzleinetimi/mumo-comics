#!/usr/bin/env tsx

/**
 * Creates placeholder SVG images for comic covers and panels
 * Run with: npx tsx scripts/create-placeholders.ts
 */

import fs from 'fs/promises';
import path from 'path';

const COMICS = [
  {
    slug: 'test-comic',
    title: 'Test Comic',
    panels: 2,
  },
  {
    slug: 'cable-chaos',
    title: 'Cable Chaos',
    panels: 4,
  },
  {
    slug: 'streaming-dreams',
    title: 'Streaming Dreams',
    panels: 5,
  },
];

function createCoverSVG(title: string): string {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FF8C42"/>
  <rect x="50" y="50" width="1100" height="530" fill="#FFD166" rx="20"/>
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#FF8C42">${title}</text>
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="#06BEE1">A Mumo Comic</text>
</svg>`;
}

function createPanelSVG(title: string, panelNumber: number): string {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#FFD166"/>
  <rect x="20" y="20" width="760" height="560" fill="white" stroke="#FF8C42" stroke-width="4" rx="10"/>
  <text x="400" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#FF8C42">${title}</text>
  <text x="400" y="340" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="#06BEE1">Panel ${panelNumber}</text>
</svg>`;
}

async function createPlaceholders() {
  console.log('🎨 Creating placeholder images...\n');

  for (const comic of COMICS) {
    const comicDir = path.join(process.cwd(), 'public', 'comics', comic.slug);

    // Ensure directory exists
    await fs.mkdir(comicDir, { recursive: true });

    // Create cover image
    const coverPath = path.join(comicDir, 'cover.svg');
    await fs.writeFile(coverPath, createCoverSVG(comic.title));
    console.log(`✅ Created ${comic.slug}/cover.svg`);

    // Create panel images
    for (let i = 1; i <= comic.panels; i++) {
      const panelPath = path.join(
        comicDir,
        `panel-${String(i).padStart(2, '0')}.svg`
      );
      await fs.writeFile(panelPath, createPanelSVG(comic.title, i));
      console.log(
        `✅ Created ${comic.slug}/panel-${String(i).padStart(2, '0')}.svg`
      );
    }

    console.log();
  }

  console.log('✨ All placeholder images created!');
  console.log(
    '\n📝 Note: These are SVG placeholders. For production, replace with actual comic artwork.'
  );
  console.log(
    '   You can convert SVGs to WebP using the optimize-images script (to be created in a later task).'
  );
}

createPlaceholders().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
