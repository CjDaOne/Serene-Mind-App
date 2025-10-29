# 🔍 Sentry Error Tracking Setup (Future Enhancement)

This document describes how to add Sentry error tracking when ready for advanced monitoring.

## Why Sentry?

- **Real-time error tracking** with stack traces
- **User context** (who experienced the error)
- **Performance monitoring** for API routes and pages
- **Release tracking** to see when bugs were introduced
- **Alerts** via email/Slack when errors spike

## When to Add Sentry

Consider adding Sentry when:
- You have 100+ active users
- You need to track production errors systematically
- You want performance insights beyond Vercel Analytics
- You need error alerting and trend analysis

## Setup Instructions

### 1. Create Sentry Account

1. Go to https://sentry.io
2. Sign up (free tier: 5,000 errors/month)
3. Create a new project:
   - **Platform:** Next.js
   - **Project Name:** Serene Mind App

### 2. Install Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

The wizard will:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.ts`
- Add environment variables

### 3. Configure Client-Side (sentry.client.config.ts)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send errors from development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.filter(
        crumb => !crumb.message?.includes('password')
      );
    }
    
    return event;
  },
});
```

### 4. Configure Server-Side (sentry.server.config.ts)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: 0.1,
  
  environment: process.env.NODE_ENV,
  
  // Capture MongoDB errors
  integrations: [
    new Sentry.Integrations.Mongo(),
  ],
  
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Scrub sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    
    return event;
  },
});
```

### 5. Add Environment Variables

Add to Vercel:

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=serene-mind-app
SENTRY_AUTH_TOKEN=your-auth-token
```

### 6. Update Error Boundary

Replace logger with Sentry in `src/app/error.tsx`:

```typescript
import * as Sentry from '@sentry/nextjs';

useEffect(() => {
  Sentry.captureException(error, {
    contexts: {
      page: {
        path: window.location.pathname,
      },
    },
    tags: {
      errorBoundary: true,
    },
  });
}, [error]);
```

### 7. Add to API Routes

Example for `src/app/api/tasks/route.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

export async function POST(req: Request) {
  try {
    // Your code
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/tasks',
        method: 'POST',
      },
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    });
    
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
```

### 8. Performance Monitoring

Track custom performance metrics:

```typescript
import * as Sentry from '@sentry/nextjs';

const transaction = Sentry.startTransaction({
  name: 'Create Journal Entry',
  op: 'api.journal.create',
});

try {
  const span = transaction.startChild({
    op: 'db.query',
    description: 'Insert journal entry',
  });
  
  await db.collection('journal').insertOne(entry);
  
  span.finish();
} finally {
  transaction.finish();
}
```

### 9. User Feedback

Add user feedback widget:

```typescript
import * as Sentry from '@sentry/nextjs';

// In error boundary or global error handler
const eventId = Sentry.captureException(error);

// Show feedback dialog
Sentry.showReportDialog({
  eventId,
  title: 'Something went wrong',
  subtitle: 'Our team has been notified',
  subtitle2: 'If you\'d like to help, tell us what happened below.',
  user: {
    email: session.user.email,
    name: session.user.name,
  },
});
```

## Cost Considerations

**Free Tier:**
- 5,000 errors/month
- 10,000 performance units/month
- 30-day data retention

**Team Plan ($26/month):**
- 50,000 errors/month
- 100,000 performance units/month
- 90-day retention

## Alternative: Vercel Analytics + Logger

For now, we use:
- **Vercel Analytics** for basic metrics (free)
- **Custom logger** (`src/lib/logger.ts`) for structured logging
- **Error boundaries** with context tracking

This provides:
- ✅ Zero cost
- ✅ Error logging in Vercel function logs
- ✅ User context and timestamps
- ✅ Production-safe (no sensitive data)

## When to Upgrade

Upgrade to Sentry when:
1. Monthly errors exceed 100
2. Need better error grouping/deduplication
3. Want performance monitoring
4. Need team collaboration on bugs
5. Require issue alerting (email/Slack)

## Resources

- Sentry Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Next.js Integration: https://vercel.com/integrations/sentry
- Performance Monitoring: https://docs.sentry.io/product/performance/
