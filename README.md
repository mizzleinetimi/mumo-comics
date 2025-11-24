# Mumo Comics

A static-first, SEO-optimized web platform for publishing weekly short comics featuring the character Mumo.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom Mumo branding colors
- **Linting:** ESLint with Next.js config
- **Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
mumo-comics/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components
├── lib/              # Utility functions and business logic
├── types/            # TypeScript type definitions
├── content/          # MDX comic content files
├── public/           # Static assets
└── .kiro/            # Kiro specs and documentation
```

## Mumo Branding Colors

- **Orange:** `#FF8C42` (mumo-orange)
- **Yellow:** `#FFD166` (mumo-yellow)
- **Blue:** `#06BEE1` (mumo-blue)

## Development Workflow

This project uses Husky and lint-staged to ensure code quality:

- Pre-commit hooks automatically run ESLint and Prettier on staged files
- TypeScript strict mode is enabled for type safety
- All code must pass linting and type checking before committing

## License

Private project for Mumo Comics.
