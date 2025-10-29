import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/db-init';
import { CreateTaskSchema, TaskDTO, fromTaskDTO, toTaskDTO } from '@/lib/domain/task';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();

    const tasks = await db.collection('tasks')
      .find({ userId: session.user.id })
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

    return NextResponse.json(taskDTOs);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
  }, rateLimitConfig.tasks);
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = CreateTaskSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid task data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const task = validationResult.data;
    const db = await getDatabase();

    const taskDoc = {
      ...task,
      userId: session.user.id,
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

    return NextResponse.json(createdTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
  }, rateLimitConfig.tasks);
}
