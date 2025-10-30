# 🏗️ Architecture Overview

Technical architecture and design decisions for the Serene Mind App.

---

## 🎯 System Architecture

Serene Mind is a **Progressive Web App (PWA)** built with a modern serverless architecture designed for scalability, offline capability, and excellent user experience.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  React UI    │  │Service Worker│  │ IndexedDB    │     │
│  │  (Next.js)   │  │  (Offline)   │  │  (Cache)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Next.js App Router (SSR/SSG)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                  Serverless Functions                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   API    │  │   Auth   │  │    AI    │  │   Push   │  │
│  │  Routes  │  │NextAuth.js│ │  Genkit  │  │Notif.    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
            ↕               ↕              ↕
    ┌──────────────┐  ┌──────────┐  ┌──────────────┐
    │   MongoDB    │  │  Google  │  │   Google     │
    │    Atlas     │  │  OAuth   │  │  Gemini AI   │
    └──────────────┘  └──────────┘  └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 15.3.3 |
| **React** | UI library | 18.3.1 |
| **TypeScript** | Type safety | 5.x |
| **TailwindCSS** | Styling framework | 3.4.1 |
| **ShadCN UI** | Component library | Latest |
| **Lucide React** | Icon library | 0.469.0 |

### Backend & APIs

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js API Routes** | Serverless API endpoints | 15.3.3 |
| **NextAuth.js** | Authentication | 4.24.11 |
| **MongoDB** | Database | 5.9.2 |
| **Google Genkit** | AI orchestration | 1.14.1 |
| **Gemini API** | AI insights | 2.0 Flash |
| **Web Push** | Push notifications | 3.6.7 |

### State Management

| Technology | Purpose | Version |
|------------|---------|---------|
| **React State** | Local component state | Built-in |
| **Zustand** | Global state management | 5.0.8 |
| **TanStack Query** | Server state caching | 5.90.5 |

### PWA & Offline

| Technology | Purpose | Version |
|------------|---------|---------|
| **Serwist** | Service worker framework | 9.2.1 |
| **Web App Manifest** | PWA metadata | Built-in |
| **Cache API** | Offline asset caching | Built-in |

### Testing

| Technology | Purpose | Version |
|------------|---------|---------|
| **Jest** | Unit testing | 30.2.0 |
| **Testing Library** | React component testing | 16.3.0 |
| **Playwright** | E2E testing | 1.49.1 |

### Development Tools

| Technology | Purpose | Version |
|------------|---------|---------|
| **ESLint** | Code linting | 9.38.0 |
| **TypeScript Compiler** | Type checking | 5.x |
| **Turbopack** | Fast bundler (dev) | Built-in |

---

## 🗂️ Project Structure

```
serene-mind-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth routes group
│   │   │   └── auth/            # Sign-in pages
│   │   ├── (protected)/         # Protected routes group
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── tasks/           # Task management
│   │   │   ├── journal/         # Journaling
│   │   │   ├── calendar/        # Calendar view
│   │   │   ├── affirmations/    # Daily affirmations
│   │   │   └── rewards/         # Rewards system
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── tasks/           # Task CRUD
│   │   │   ├── journal/         # Journal CRUD
│   │   │   ├── rewards/         # Rewards API
│   │   │   └── subscribe/       # Push notifications
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── manifest.ts          # PWA manifest
│   │   └── offline/             # Offline fallback
│   ├── components/              # React components
│   │   ├── ui/                  # ShadCN UI primitives
│   │   ├── dashboard/           # Dashboard components
│   │   ├── tasks/               # Task components
│   │   ├── journal/             # Journal components
│   │   └── shared/              # Shared components
│   ├── lib/                     # Utility libraries
│   │   ├── mongodb.ts           # Database client
│   │   ├── auth.ts              # Auth configuration
│   │   ├── types.ts             # TypeScript types
│   │   ├── utils.ts             # Helper functions
│   │   ├── logger.ts            # Logging utility
│   │   └── rate-limit.ts        # Rate limiting
│   ├── ai/                      # AI flows
│   │   ├── flows/               # Genkit AI flows
│   │   │   ├── journal-insights.ts
│   │   │   └── task-suggestions.ts
│   │   └── genkit.ts            # AI configuration
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-toast.ts
│   │   └── use-notifications.ts
│   └── styles/                  # Global styles
│       └── globals.css
├── public/                      # Static assets
│   ├── icons/                   # PWA icons
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── apple-touch-icon.png
│   ├── images/                  # App images
│   └── sw.js                    # Service worker
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   └── e2e/                     # E2E tests
├── docs/                        # Documentation
└── scripts/                     # Build scripts
```

---

## 🔑 Key Design Decisions

### 1. **Next.js App Router**

**Why:** 
- Server-side rendering for better SEO and initial load
- Automatic code splitting
- Built-in API routes (serverless functions)
- File-based routing
- React Server Components support

**Trade-offs:**
- ✅ Better performance and SEO
- ✅ Simplified deployment (Vercel)
- ❌ Steeper learning curve than Pages Router
- ❌ Requires understanding of client/server boundaries

### 2. **MongoDB with User Isolation**

**Why:**
- Flexible schema for evolving features
- Excellent performance for document-based data (tasks, journals)
- Built-in aggregation for analytics
- Free tier sufficient for MVP (MongoDB Atlas M0)
- User data isolation via `userId` field in all collections

**Trade-offs:**
- ✅ Fast development iteration
- ✅ Scalable with sharding
- ✅ Free tier available
- ❌ Requires careful query optimization
- ❌ No foreign key constraints (handled in application)

### 3. **NextAuth.js for Authentication**

**Why:**
- Supports multiple providers (Google OAuth, Email)
- Built-in session management
- MongoDB adapter for persistence
- Secure by default (JWT + database sessions)
- Guest mode via anonymous JWT

**Trade-offs:**
- ✅ Production-ready security
- ✅ Easy to add providers
- ✅ Active maintenance
- ❌ Complex configuration for custom flows
- ❌ Limited customization of UI

### 4. **Google Genkit for AI**

**Why:**
- Unified interface for AI models
- Built-in prompt engineering
- Flow-based architecture
- Excellent TypeScript support
- Developer UI for debugging

**Trade-offs:**
- ✅ Vendor-agnostic (can swap models)
- ✅ Type-safe AI flows
- ❌ Newer framework (smaller community)
- ❌ Google ecosystem focused

### 5. **Serverless Architecture (Vercel)**

**Why:**
- Zero DevOps overhead
- Automatic scaling
- Edge network for global performance
- Free tier for hobby projects
- CI/CD built-in

**Trade-offs:**
- ✅ Instant deployment
- ✅ Pay-per-use pricing
- ❌ Cold start latency (~300ms)
- ❌ Function timeout limits (10s on free tier)
- ❌ Vendor lock-in concerns

### 6. **Progressive Web App (PWA)**

**Why:**
- Installable on all platforms
- Offline functionality
- Push notifications
- App-like experience
- No app store approval needed

**Trade-offs:**
- ✅ Cross-platform with one codebase
- ✅ Instant updates
- ❌ Limited iOS capabilities (no background sync)
- ❌ Requires HTTPS
- ❌ Safari has partial PWA support

### 7. **ShadCN UI Components**

**Why:**
- Copy-paste components (not npm package)
- Full control over code
- Built on Radix UI (accessibility)
- TailwindCSS integration
- Highly customizable

**Trade-offs:**
- ✅ No bundle bloat
- ✅ Easy customization
- ❌ Manual updates required
- ❌ No built-in theming system

---

## 🔐 Security Architecture

### Authentication Flow

```
┌──────────┐         ┌───────────┐         ┌──────────┐
│  User    │────1───▶│ NextAuth  │────2───▶│  Google  │
│  Browser │         │  /api/auth│         │  OAuth   │
└──────────┘         └───────────┘         └──────────┘
     │                     │                      │
     │◀────────────────────┴──────────────────────┘
     │         3. JWT + Session Cookie
     │
     ▼
┌──────────────────────────────────────────┐
│  Protected Routes (Middleware Check)     │
│  - Verify session exists                 │
│  - Check user authentication             │
│  - Redirect to /auth/signin if invalid   │
└──────────────────────────────────────────┘
```

### Data Isolation

All database queries include `userId` filter:

```typescript
// ✅ Correct - User-isolated query
const tasks = await db.collection('tasks')
  .find({ userId: session.user.id })
  .toArray();

// ❌ Wrong - Potential data leak
const tasks = await db.collection('tasks')
  .find({})
  .toArray();
```

### Rate Limiting

API routes protected with in-memory rate limiter:

- **10 requests/10s** - Tasks, Journal APIs
- **5 requests/10s** - Rewards API
- Tracked by authenticated user ID or IP
- Returns HTTP 429 when exceeded

### Environment Variables

Sensitive data stored in environment variables:

- ✅ Never committed to git
- ✅ Different values for dev/prod
- ✅ Rotated quarterly
- ✅ Accessed via `process.env`

---

## 📊 Database Schema

### Collections

#### `users`
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  image?: string,
  emailVerified?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### `tasks`
```typescript
{
  _id: ObjectId,
  userId: string,           // User isolation
  title: string,
  description?: string,
  completed: boolean,
  priority: 'low' | 'medium' | 'high',
  dueDate?: Date,
  subtasks: SubTask[],
  createdAt: Date,
  updatedAt: Date
}
```

#### `journal`
```typescript
{
  _id: ObjectId,
  userId: string,           // User isolation
  entry: string,
  mood: number,             // 1-10 scale
  date: Date,
  aiInsights?: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### `rewards`
```typescript
{
  _id: ObjectId,
  userId: string,           // User isolation
  points: number,
  level: number,
  achievements: Achievement[],
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Tasks - Fast user queries sorted by date
db.tasks.createIndex({ userId: 1, createdAt: -1 });
db.tasks.createIndex({ userId: 1, completed: 1 });

// Journal - Fast user queries sorted by date
db.journal.createIndex({ userId: 1, date: -1 });
db.journal.createIndex({ userId: 1, mood: 1 });

// Rewards - Fast user lookup
db.rewards.createIndex({ userId: 1 });
```

---

## 🚀 Performance Optimizations

### 1. **Service Worker Caching**
- Static assets cached indefinitely
- API responses cached with TTL
- Offline fallback page

### 2. **Code Splitting**
- Automatic route-based splitting
- Dynamic imports for heavy components
- Tree shaking in production

### 3. **Image Optimization**
- Next.js Image component
- Automatic WebP conversion
- Lazy loading

### 4. **MongoDB Connection Pooling**
- `maxPoolSize: 1` (serverless optimized)
- 10s idle timeout
- Cached connection reuse

### 5. **React Server Components**
- Reduced client bundle size
- Server-side data fetching
- Zero-JS components where possible

---

## 🔄 Data Flow

### Task Creation Flow

```
User Input (Client)
    ↓
React Form Submit
    ↓
POST /api/tasks
    ↓
Middleware (Auth Check)
    ↓
Rate Limiter
    ↓
MongoDB Insert { userId, ...data }
    ↓
Return Task Object
    ↓
Update UI State
    ↓
Service Worker Cache Update
```

### AI Insight Generation Flow

```
Journal Entry (Client)
    ↓
POST /api/journal
    ↓
Save to MongoDB
    ↓
Trigger AI Flow (Genkit)
    ↓
Gemini API Call
    ↓
Parse AI Response
    ↓
Update Journal with Insights
    ↓
Return to Client
```

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- Utility functions
- Coverage target: 70%+

### E2E Tests
- Authentication flows
- Task CRUD operations
- Journal creation
- PWA installation
- Offline mode

### Manual Testing
- Cross-browser compatibility
- Mobile responsiveness
- PWA install on iOS/Android
- Push notifications

---

## 📚 Related Documentation

- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - MongoDB configuration
- **[TYPES_GUIDE.md](TYPES_GUIDE.md)** - TypeScript types reference
- **[../features/GUEST_MODE.md](../features/GUEST_MODE.md)** - Guest mode architecture
- **[../security/SENTRY_SETUP.md](../security/SENTRY_SETUP.md)** - Error monitoring
- **[../../DEPLOYMENT.md](../../DEPLOYMENT.md)** - Production deployment

---

**Questions?** See [docs/INDEX.md](../INDEX.md) for more documentation.
