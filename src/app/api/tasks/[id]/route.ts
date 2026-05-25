import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db-init';
import { ObjectId } from 'mongodb';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';
import { withApiHandler, successResponse, errorResponse } from '@/lib/api-handler';
import type { Session } from 'next-auth';

function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async (r) => {
      const { id } = await params;

      const objectId = parseObjectId(id);
      if (!objectId) {
        return errorResponse('INVALID_ID', 'Invalid task ID', 400);
      }

      const body = await r.json();
      const db = await getDatabase();

      const result = await db.collection('tasks').updateOne(
        { _id: objectId, userId: (session as Session).user.id },
        { $set: { ...body, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return errorResponse('NOT_FOUND', 'Task not found', 404);
      }

      return successResponse({ success: true });
    }, { session })(req);
  }, rateLimitConfig.tasks);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async (r) => {
      const { id } = await params;

      const objectId = parseObjectId(id);
      if (!objectId) {
        return errorResponse('INVALID_ID', 'Invalid task ID', 400);
      }

      const db = await getDatabase();

      const result = await db.collection('tasks').deleteOne({
        _id: objectId,
        userId: (session as Session).user.id,
      });

      if (result.deletedCount === 0) {
        return errorResponse('NOT_FOUND', 'Task not found', 404);
      }

      return successResponse({ success: true });
    }, { session })(req);
  }, rateLimitConfig.tasks);
}
