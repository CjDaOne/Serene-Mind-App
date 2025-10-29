import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/db-init';
import { CreateTaskSchema, TaskDTO, fromTaskDTO, toTaskDTO } from '@/lib/domain/task';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';
import { withApiHandler, successResponse } from '@/lib/api-handler';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    return withApiHandler(async (req) => {
      const session = await getServerSession(authOptions);
      const db = await getDatabase();

      const tasks = await db.collection('tasks')
        .find({ userId: session!.user!.id })
        .sort({ createdAt: -1 })
        .toArray();

      const taskDTOs: TaskDTO[] = tasks.map(task => ({
        id: task._id.toString(),
        title: task.title,
        description: task.description || '',
        completed: task.completed,
        dueDate: task.dueDate.toISOString(),
        priority: task.priority,
        subtasks: task.subtasks || [],
      }));

      return successResponse(taskDTOs);
    })(request);
  }, rateLimitConfig.tasks);
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    return withApiHandler(async (r) => {
      const session = await getServerSession(authOptions);
      const body = await r.json();
      
      const task = CreateTaskSchema.parse(body);
      const db = await getDatabase();

      const taskDoc = {
        ...task,
        userId: session!.user!.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection('tasks').insertOne(taskDoc);

      const createdTask: TaskDTO = {
        id: result.insertedId.toString(),
        title: task.title,
        description: task.description || '',
        completed: task.completed,
        dueDate: task.dueDate.toISOString(),
        priority: task.priority,
        subtasks: task.subtasks,
      };

      return successResponse(createdTask, 201);
    })(req);
  }, rateLimitConfig.tasks);
}
