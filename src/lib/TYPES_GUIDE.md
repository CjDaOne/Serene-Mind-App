# Type Architecture Guide

This document explains the type system architecture for the Serene Mind App, including when to use each type and where to import them from.

## Type Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                     Type Layers                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Domain Models (src/lib/domain/*)                   │
│     - Server-side data structures with Date objects    │
│     - Zod schemas for validation                        │
│     - Business logic types                              │
│                                                         │
│  2. API DTOs (Data Transfer Objects)                   │
│     - JSON-serializable versions of domain models      │
│     - Date → string conversions                         │
│     - Wire format for HTTP requests/responses          │
│                                                         │
│  3. Client Types (src/lib/types.ts)                    │
│     - Re-exports of domain models for client use       │
│     - Legacy compatibility layer                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## File Structure

### 1. Domain Models (`src/lib/domain/*`)

Each domain has its own file with:
- **Zod Schemas**: Runtime validation + TypeScript types
- **Domain Types**: Server-side types with native Date objects
- **DTO Types**: JSON-safe versions for API responses
- **Converters**: Functions to convert between domain and DTO

**Files:**
- `src/lib/domain/task.ts` - Task management
- `src/lib/domain/journal.ts` - Journal entries
- `src/lib/domain/achievement.ts` - Rewards and achievements

### 2. Legacy Types (`src/lib/types.ts`)

Re-exports domain types for backward compatibility. Prefer importing directly from domain files in new code.

---

## Type Categories

### Task Types

**Location:** `src/lib/domain/task.ts`

#### Domain Types (Server-side)
```typescript
// Task - Full domain model with Date objects
type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;              // ← Native Date object
  subtasks: Subtask[];
  priority: Priority;
}

// CreateTask - Input schema for creating tasks
type CreateTask = Omit<Task, 'id'> & {
  dueDate: Date | string;     // ← Coerced to Date
}
```

#### DTO Types (API Layer)
```typescript
// TaskDTO - JSON-safe version for API responses
type TaskDTO = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;            // ← ISO string for JSON
  subtasks: Subtask[];
  priority: Priority;
}
```

#### Helper Functions
```typescript
// Convert domain model to DTO (for API responses)
toTaskDTO(task: Task): TaskDTO

// Convert DTO to domain model (when receiving from API)
fromTaskDTO(dto: TaskDTO): Task
```

---

### Journal Types

**Location:** `src/lib/domain/journal.ts`

#### Domain Types (Server-side)
```typescript
// JournalEntry - Full domain model with Date objects
type JournalEntry = {
  id: string;
  date: Date;                 // ← Native Date object
  mood: Mood;
  content: string;
}

// CreateJournalEntry - Input schema for creating entries
type CreateJournalEntry = Omit<JournalEntry, 'id'> & {
  date: Date | string;        // ← Coerced to Date
}
```

#### DTO Types (API Layer)
```typescript
// JournalEntryDTO - JSON-safe version for API responses
type JournalEntryDTO = {
  id: string;
  date: string;               // ← ISO string for JSON
  mood: Mood;
  content: string;
}
```

#### Helper Functions
```typescript
// Convert domain model to DTO (for API responses)
toJournalEntryDTO(entry: JournalEntry): JournalEntryDTO

// Convert DTO to domain model (when receiving from API)
fromJournalEntryDTO(dto: JournalEntryDTO): JournalEntry
```

---

### Achievement Types

**Location:** `src/lib/domain/achievement.ts`

#### Domain Types
```typescript
// Achievement - Rewards system
type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: IconName;
}

type IconName = 'Star' | 'BookOpen' | 'Award' | 'CalendarCheck2';
```

*Note: Achievements don't need DTOs as they don't contain Date objects.*

---

## Usage Guidelines

### ✅ When to Use Domain Types

**Server Components & API Routes:**
```typescript
// ✅ API routes use domain types internally
import { Task, CreateTaskSchema } from '@/lib/domain/task';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const task = CreateTaskSchema.parse(body);  // Validates and converts
  // task now has Date objects
}
```

**Database Operations:**
```typescript
// ✅ Store domain types in MongoDB
const taskDoc = {
  ...task,          // task: Task (with Date)
  userId: session.user.id,
  createdAt: new Date(),
};
await db.collection('tasks').insertOne(taskDoc);
```

### ✅ When to Use DTO Types

**API Responses:**
```typescript
// ✅ Return DTOs from API routes
import { TaskDTO, toTaskDTO } from '@/lib/domain/task';

export async function GET(request: NextRequest) {
  const tasks = await db.collection('tasks').find().toArray();
  
  // Convert to DTOs before sending
  const taskDTOs: TaskDTO[] = tasks.map(task => ({
    id: task._id.toString(),
    title: task.title,
    dueDate: task.dueDate.toISOString(),  // Date → string
    // ... other fields
  }));
  
  return NextResponse.json(taskDTOs);  // JSON-safe
}
```

**Client-Side Data Fetching:**
```typescript
// ✅ Client receives DTOs from API
const response = await fetch('/api/tasks');
const taskDTOs: TaskDTO[] = await response.json();  // Has string dates

// Convert to domain types for local use
const tasks: Task[] = taskDTOs.map(fromTaskDTO);  // Now has Date objects
```

### ✅ When to Use Legacy Types

**Client Components (Backward Compatibility):**
```typescript
// ✅ For existing code using legacy imports
import type { Task, JournalEntry } from '@/lib/types';

// ✨ Prefer domain imports in new code:
import type { Task, JournalEntry } from '@/lib/domain/task';
```

---

## Common Patterns

### Pattern 1: API Route Structure

```typescript
// src/app/api/tasks/route.ts
import { CreateTaskSchema, TaskDTO } from '@/lib/domain/task';

export async function POST(request: NextRequest) {
  // 1. Validate input using schema
  const body = await request.json();
  const task = CreateTaskSchema.parse(body);  // Domain type
  
  // 2. Store in database
  const taskDoc = { ...task, userId: session.user.id };
  const result = await db.collection('tasks').insertOne(taskDoc);
  
  // 3. Return DTO
  const createdTask: TaskDTO = {
    id: result.insertedId.toString(),
    ...task,
    dueDate: task.dueDate.toISOString(),  // Convert Date → string
  };
  
  return NextResponse.json(createdTask);
}
```

### Pattern 2: Client Component Structure

```typescript
// src/components/tasks/task-manager.tsx
'use client';

import { fromTaskDTO } from '@/lib/domain/task';
import type { Task } from '@/lib/types';  // or from '@/lib/domain/task'

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Fetch DTOs from API
    fetch('/api/tasks')
      .then(res => res.json())
      .then(dtos => {
        // Convert to domain types
        const tasks = dtos.map(fromTaskDTO);
        setTasks(tasks);
      });
  }, []);
  
  return <div>{/* render tasks */}</div>;
}
```

### Pattern 3: Server Component Structure

```typescript
// src/app/tasks/page.tsx (Server Component)
import { getServerSession } from 'next-auth';
import { getDatabase } from '@/lib/db-init';
import type { Task } from '@/lib/domain/task';

export default async function TasksPage() {
  const session = await getServerSession(authOptions);
  const db = await getDatabase();
  
  // Fetch and work with domain types directly
  const tasks = await db.collection('tasks')
    .find({ userId: session.user.id })
    .toArray() as Task[];
  
  return <TasksClient tasks={tasks} />;  // Pass domain types to client
}
```

---

## Date Handling Rules

### Server Side (API Routes, Server Components)
- ✅ **Use Domain Types** with `Date` objects
- ✅ Store as native `Date` in MongoDB
- ✅ Perform date operations with native Date API

### API Boundary (Request/Response)
- ✅ **Use DTO Types** with ISO string dates
- ✅ Convert `Date → string` when sending to client
- ✅ Convert `string → Date` when receiving from client

### Client Side (React Components)
- ✅ **Use Domain Types** after converting DTOs
- ✅ Convert DTOs immediately after fetching
- ✅ Work with `Date` objects for calculations

---

## Zod Schema Validation

### Why Zod?

Zod provides:
1. **Runtime validation** - Catch invalid data at runtime
2. **Type inference** - Generate TypeScript types automatically
3. **Coercion** - Convert strings to Dates automatically
4. **Error messages** - Detailed validation errors

### Schema Usage

```typescript
// Define schema
export const CreateTaskSchema = TaskSchema.omit({ id: true }).extend({
  dueDate: z.coerce.date(),  // Automatically converts string → Date
});

// Use in API routes
const validationResult = CreateTaskSchema.safeParse(body);

if (!validationResult.success) {
  return NextResponse.json(
    { error: 'Invalid data', details: validationResult.error.issues },
    { status: 400 }
  );
}

const task = validationResult.data;  // Fully validated with Date objects
```

---

## Migration Guide

### Updating Existing Code

If you need to refactor existing code to use this type system:

1. **Identify the layer:**
   - Server code (API routes, Server Components) → Use domain types
   - API responses → Use DTOs
   - Client components → Use domain types after converting DTOs

2. **Update imports:**
   ```typescript
   // Before
   import type { Task } from '@/lib/types';
   
   // After
   import type { Task } from '@/lib/domain/task';
   ```

3. **Add conversion at API boundaries:**
   ```typescript
   // In client code after fetch
   const taskDTOs = await response.json();
   const tasks = taskDTOs.map(fromTaskDTO);  // Convert DTOs → domain types
   ```

---

## Design Decisions

### Why DTOs?

**Problem:** JavaScript Date objects can't be serialized to JSON directly.

```typescript
// ❌ This doesn't work as expected
const task = { dueDate: new Date() };
JSON.stringify(task);
// Result: {"dueDate":"2025-10-29T12:00:00.000Z"}  ← Now a string!
```

**Solution:** Explicit DTO types with string dates.

```typescript
// ✅ Clear contract
type TaskDTO = { dueDate: string };  // Always a string in JSON

// ✅ Server converts before sending
const dto: TaskDTO = {
  ...task,
  dueDate: task.dueDate.toISOString()
};
```

### Why Not Separate Request/Response Types?

**Current approach:**
- `CreateTaskSchema` - Request input (validated, coerced to Date)
- `TaskDTO` - Response output (JSON-safe with string dates)
- `Task` - Internal domain model

This is clear and sufficient for our use case. We could split further:
- `CreateTaskRequest`
- `UpdateTaskRequest`  
- `TaskResponse`

But this adds complexity without clear benefits for our current app size.

---

## Type Checklist

When adding a new domain model, create:

- [ ] **Zod Schema** - `EntitySchema`
- [ ] **Domain Type** - `type Entity = z.infer<typeof EntitySchema>`
- [ ] **Create Schema** - `CreateEntitySchema` (if needed)
- [ ] **DTO Type** - `EntityDTO` (if has Dates)
- [ ] **Converters** - `toEntityDTO()` and `fromEntityDTO()` (if has Dates)
- [ ] **Tests** - Validate schemas work correctly

---

## Related Documentation

- [DATABASE_SETUP.md](../../DATABASE_SETUP.md) - MongoDB schemas
- [DEPLOYMENT.md](../../DEPLOYMENT.md) - Environment variables
- [API Routes](../app/api) - API implementation examples

---

## Questions?

If you're unsure which type to use:

1. **Are you in an API route?**
   - Input validation → Use `CreateEntitySchema`
   - Response → Use `EntityDTO`

2. **Are you in a Server Component?**
   - Use domain types (`Entity`)

3. **Are you in a Client Component?**
   - After API fetch → Convert DTOs to domain types
   - Local state → Use domain types

4. **Are you storing in MongoDB?**
   - Use domain types (with Date objects)

---

**Last Updated:** 2025-10-29  
**Maintained By:** Team Beta - Agent 6 (Type-Refactor)
