import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { withApiHandler, successResponse, errorResponse } from '@/lib/api-handler';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiHandler(async (req) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('serene-mind');

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id), userId: session!.user!.id },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return errorResponse('NOT_FOUND', 'Task not found', 404);
    }

    return successResponse({ success: true });
  })(request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiHandler(async (req) => {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('serene-mind');

    const result = await db.collection('tasks').deleteOne({
      _id: new ObjectId(id),
      userId: session!.user!.id,
    });

    if (result.deletedCount === 0) {
      return errorResponse('NOT_FOUND', 'Task not found', 404);
    }

    return successResponse({ success: true });
  })(request);
}
