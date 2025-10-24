# AGENTS.md - Development Guide for AI Coding Tools

## Commands
- **Dev**: `npm run dev` (runs on port 9002 with Turbopack)
- **Build**: `npm run build`
- **Typecheck**: `npm run typecheck` (tsc --noEmit)
- **Lint**: `npm run lint` (Next.js ESLint)
- **AI Dev**: `npm run genkit:dev` or `npm run genkit:watch` (for Google Genkit AI flows)
- **Test**: `npm test` (Jest with Testing Library)

## Architecture
- **Framework**: Next.js 15 with App Router (TypeScript)
- **Structure**: `src/app/` contains routes (dashboard, journal, tasks, calendar, affirmations, rewards)
- **AI Layer**: Google Genkit + Gemini API in `src/ai/` for journaling insights
- **Database**: MongoDB (planned, currently using local data in `src/lib/data.ts`)
- **Auth**: Not yet implemented (NextAuth.js planned)
- **Deployment**: Vercel (via apphosting.yaml)

## Code Style & Conventions
- **Imports**: Use `@/` alias for src imports (e.g., `@/components`, `@/lib/utils`)
- **Components**: ShadCN UI components in `src/components/ui/`, feature components in `src/components/{feature}/`
- **Styling**: TailwindCSS with CSS variables, use `cn()` utility from `@/lib/utils` for conditional classes
- **Types**: TypeScript strict mode enabled, types in `src/lib/types.ts`
- **Icon Library**: Lucide React
- **Build Config**: TypeScript and ESLint errors are ignored during builds (see next.config.ts) - but fix them anyway
