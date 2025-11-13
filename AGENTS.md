# AGENTS.md - Development Guide for AI Coding Tools

## Commands
- **Dev**: `npm run dev` (runs on port 3001 with Turbopack)
- **Build**: `npm run build`
- **Typecheck**: `npm run typecheck` (tsc --noEmit)
- **Lint**: `npm run lint` (Next.js ESLint)
- **AI Dev**: `npm run genkit:dev` or `npm run genkit:watch` (for Google Genkit AI flows)
- **Test (Unit)**: `npm test` (Jest with Testing Library)
- **Test (E2E)**: `npm run test:e2e` (Playwright E2E tests)
- **Test (E2E UI)**: `npm run test:e2e:ui` (Playwright interactive mode)

## Architecture
- **Framework**: Next.js 15 with App Router (TypeScript)
- **Structure**: `src/app/` contains routes (dashboard, journal, tasks, calendar, affirmations, rewards)
- **AI Layer**: Google Genkit + Gemini API in `src/ai/` for journaling insights
- **Database**: MongoDB with user data isolation and indexes
- **Auth**: NextAuth.js with Google OAuth + Email Magic Link + Guest Mode
- **Guest Mode**: Anonymous JWT sessions, client-side demo data, 30-minute sessions
- **PWA**: Service worker, offline support, push notifications
- **Deployment**: Vercel (via apphosting.yaml)

## Code Style & Conventions
- **Imports**: Use `@/` alias for src imports (e.g., `@/components`, `@/lib/utils`)
- **Components**: ShadCN UI components in `src/components/ui/`, feature components in `src/components/{feature}/`
- **Styling**: TailwindCSS with CSS variables, use `cn()` utility from `@/lib/utils` for conditional classes
- **Types**: TypeScript strict mode enabled, types in `src/lib/types.ts`
- **Icon Library**: Lucide React
- **Build Config**: TypeScript and ESLint errors are ignored during builds (see next.config.ts) - but fix them anyway

## Environment Variables

See `.env.local.example` for all required environment variables:

- **Database**: `MONGODB_URI`, `MONGODB_DB`
- **Auth**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **OAuth**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Email**: `EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`
- **PWA**: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
- **AI**: `GOOGLE_GENAI_API_KEY`, `GENKIT_MODEL`

## Deployment

See `DEPLOYMENT.md` for comprehensive deployment guide including:

- MongoDB Atlas setup and indexes
- Google OAuth configuration
- Email service setup (Resend recommended)
- VAPID keys generation for push notifications
- Vercel deployment with environment variables
- Post-deployment verification checklist

## Features

### Core Features
- **Task Management**: Create, edit, complete, and delete tasks with subtasks
- **Journaling**: Private journal entries with mood tracking
- **Calendar View**: Visual task planning and progress tracking
- **Daily Affirmations**: Positive affirmations library
- **Rewards System**: Achievement tracking and gamification
- **AI Insights**: Google Gemini-powered journaling insights and task suggestions

### Authentication Options
- **Google OAuth**: One-click sign-in with Google account
- **Email Magic Link**: Passwordless authentication via email
- **Guest Mode**: Try the app without creating an account
  - 30-minute anonymous sessions
  - Client-side demo data (no database)
  - Limited creation (5 tasks, 3 journals)
  - Easy upgrade flow with optional data migration

### Progressive Web App (PWA)
- Installable on all devices (iOS, Android, desktop)
- Offline-first architecture with service worker
- Push notifications for reminders
- App-like experience with fullscreen mode

## Documentation

For deployment guides and infrastructure setup, see:
- `DEPLOYMENT.md` - Complete deployment instructions
- `README.md` - Project overview and features
- `docs/` - Additional documentation including testing plans and infrastructure validation
