# **SereneMind Development Playbook**

## **📌 Simplified Development & Validation Approach**

### **Overview**

This playbook provides a pragmatic approach to completing the Serene Mind App by focusing on **direct implementation** rather than meta-infrastructure. Use a simple validation script to catch issues early, then implement features directly.

---

## **1️⃣ Quick Validation - Doctor Script**

Instead of complex agent systems, use a single validation script to check project health.

### **Create `scripts/doctor.ts`**

```ts
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || '';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

async function checkEnvironment() {
  console.log('\n🔍 Checking Environment Variables...\n');
  
  const checks = [
    { name: 'MONGODB_URI', value: MONGODB_URI },
    { name: 'NEXTAUTH_SECRET', value: NEXTAUTH_SECRET },
    { name: 'GOOGLE_CLIENT_ID', value: GOOGLE_CLIENT_ID },
    { name: 'GOOGLE_CLIENT_SECRET', value: GOOGLE_CLIENT_SECRET }
  ];

  checks.forEach(({ name, value }) => {
    console.log(value ? `✅ ${name}` : `❌ ${name} - MISSING`);
  });
}

async function checkMongoConnection() {
  console.log('\n🔍 Checking MongoDB Connection...\n');
  
  if (!MONGODB_URI) {
    console.log('❌ Cannot test - MONGODB_URI missing');
    return;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ MongoDB connected successfully');
    await client.close();
  } catch (err) {
    console.log(`❌ MongoDB connection failed: ${err}`);
  }
}

async function checkAPIRoutes() {
  console.log('\n🔍 Checking API Routes...\n');
  
  const routes = [
    './src/app/api/tasks/route.ts',
    './src/app/api/journal/route.ts',
    './src/app/api/auth/[...nextauth]/route.ts'
  ];

  const fs = require('fs');
  routes.forEach(route => {
    console.log(fs.existsSync(route) ? `✅ ${route}` : `⚠️  ${route} - MISSING`);
  });
}

async function checkAuthProtection() {
  console.log('\n🔍 Checking Route Protection...\n');
  console.log('⚠️  Recommendation: Use middleware.ts or server-side auth checks');
  console.log('   Protected routes should include: /dashboard, /tasks, /journal, /calendar, /rewards');
}

async function doctor() {
  console.log('🏥 SereneMind Health Check\n');
  console.log('='.repeat(50));
  
  await checkEnvironment();
  await checkMongoConnection();
  await checkAPIRoutes();
  await checkAuthProtection();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n✨ Health check complete!\n');
}

doctor();
```

### **Run the doctor script:**

```bash
npx tsx scripts/doctor.ts
```

---

## **2️⃣ Critical Fixes Needed**

### **A. Fix NextAuth Error Page Location**

**Current (WRONG):** `src/app/api/auth/error/page.tsx`  
**Correct:** `src/app/auth/error/page.tsx`

The `/app/api` directory is for API route handlers only, not pages.

```tsx
// src/app/auth/error/page.tsx
export default function AuthError({
  searchParams
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error || 'Unknown error';
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
      </div>
    </div>
  );
}
```

Update NextAuth config to use this page:
```ts
pages: {
  error: '/auth/error'
}
```

---

### **B. Fix Schema Mismatches**

Create separate schemas for different operations in `src/lib/schemas/`:

```ts
// src/lib/schemas/task.ts
import { z } from 'zod';

// For creating new tasks (no id, coerce dates)
export const TaskCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  completed: z.boolean().default(false)
});

// For updating tasks (partial fields)
export const TaskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  completed: z.boolean().optional()
});

// Data Transfer Object (dates as ISO strings for JSON)
export const TaskDTOSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string(), // ISO string
  priority: z.enum(['low', 'medium', 'high']),
  completed: z.boolean(),
  userId: z.string()
});

export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
export type TaskDTO = z.infer<typeof TaskDTOSchema>;
```

Update API routes to use these schemas correctly:

```ts
// POST /api/tasks - Create
const body = TaskCreateSchema.parse(await request.json());
// ... create in DB ...
return NextResponse.json({
  ...task,
  dueDate: task.dueDate.toISOString() // Convert Date to ISO string
});

// GET /api/tasks - List
return NextResponse.json(tasks.map(task => ({
  ...task,
  id: task._id.toString(),
  dueDate: task.dueDate.toISOString()
})));
```

---

### **C. Use Native MongoDB (Not Mongoose)**

The app already uses the native MongoDB driver in `src/lib/mongodb.ts`. Don't add Mongoose.

**Remove if present:**
- `mongoose` from package.json
- Any `src/lib/models/` Mongoose schemas
- Mongoose imports from any agents or scripts

**Use the existing connection:**
```ts
import clientPromise from '@/lib/mongodb';

const client = await clientPromise;
const db = client.db('serene-mind');
const tasks = db.collection('tasks');
```

---

### **D. Add Server-Side Route Protection**

**Option 1: Middleware (Recommended)**

```ts
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/tasks/:path*', '/journal/:path*', '/calendar/:path*', '/rewards/:path*']
};
```

**Option 2: Server Component Checks**

```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }
  
  return <div>Protected content</div>;
}
```

---

## **3️⃣ Development Workflow**

### **Setup**
1. Copy `.env.example` to `.env.local`
2. Add MongoDB URI and NextAuth credentials
3. Run `npm install`
4. Run `npx tsx scripts/doctor.ts` to validate

### **Development**
1. Run `npm run dev` (port 3000)
2. Ensure `NEXTAUTH_URL=http://localhost:3000`
3. Check types: `npm run typecheck`
4. Check lint: `npm run lint`
5. Run tests: `npm test`

### **Before Committing**
1. Run doctor script
2. Fix any TypeScript errors
3. Test authentication flow
4. Verify API routes work

---

## **4️⃣ Implementation Status**

### **✅ Completed**
- Next.js 15 app structure with App Router
- TailwindCSS + ShadCN UI components
- NextAuth.js with Google OAuth
- MongoDB native driver setup
- Basic API routes structure
- Google Genkit AI integration

### **🔧 Needs Fixing**
- [ ] Move NextAuth error page to correct location
- [ ] Fix schema separation (Create/Update/DTO)
- [ ] Add server-side route protection (middleware)
- [ ] Update API routes to use correct schemas
- [ ] Remove any Mongoose dependencies
- [ ] Fix port consistency (use 3000)

### **📋 Next Features**
- [ ] Complete React Query hooks for tasks/journal
- [ ] Implement calendar functionality
- [ ] Add rewards system logic
- [ ] Enhance AI journaling insights
- [ ] Add comprehensive tests

---

## **5️⃣ Key Principles**

1. **KISS (Keep It Simple)** - Direct implementation beats meta-infrastructure
2. **Server-First** - Protect routes server-side, not just client-side
3. **Type Safety** - Separate Create/Update/DTO schemas, coerce dates properly
4. **Single Source of Truth** - Use native MongoDB driver consistently
5. **Fast Feedback** - Run doctor script + typecheck frequently

---

## **6️⃣ Useful Commands**

```bash
# Health check
npx tsx scripts/doctor.ts

# Development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm test

# AI development
npm run genkit:dev
```

---

**This playbook prioritizes shipping working features over building automation tools. Focus on implementation, use the doctor script for validation, and iterate quickly.**
