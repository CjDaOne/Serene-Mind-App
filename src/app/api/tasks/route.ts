import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db-init';
import { CreateTaskSchema, TaskDTO } from '@/lib/domain/task';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';
import { withApiHandler, successResponse } from '@/lib/api-handler';
import type { Session } from 'next-auth';

const DEFAULT_METRICS = { cognitiveLoad: 2, emotionalFriction: 2, energyDemand: 2 } as const;

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async () => {
      const db = await getDatabase();
      const userId = (session as Session).user.id;

      const tasks = await db.collection('tasks')
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

      const taskDTOs: TaskDTO[] = tasks.map(task => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description || '',
        completed: task.completed,
        dueDate: task.dueDate instanceof Date
          ? task.dueDate.toISOString()
          : new Date(task.dueDate).toISOString(),
        priority: task.priority,
        subtasks: task.subtasks || [],
        // Backward compat: old tasks without metrics get light defaults
        metrics: task.metrics ?? DEFAULT_METRICS,
        createdAt: task.createdAt instanceof Date
          ? task.createdAt.toISOString()
          : undefined,
      }));

      return successResponse(taskDTOs);
    }, { session })(req);
  }, rateLimitConfig.tasks);
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async (r) => {
      const body = await r.json();
      const task = CreateTaskSchema.parse(body);
      const db = await getDatabase();
      const userId = (session as Session).user.id;

      const now = new Date();
      const taskDoc = {
        ...task,
        userId,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.collection('tasks').insertOne(taskDoc);

      const created: TaskDTO = {
        id: result.insertedId.toString(),
        title: task.title,
        description: task.description || '',
        completed: task.completed,
        dueDate: task.dueDate.toISOString(),
        priority: task.priority,
        subtasks: task.subtasks ?? [],
        metrics: task.metrics,
        createdAt: now.toISOString(),
      };

      return successResponse(created, 201);
    }, { session })(req);
  }, rateLimitConfig.tasks);
}
