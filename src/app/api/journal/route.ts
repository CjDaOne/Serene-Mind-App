import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { CreateJournalEntrySchema, JournalEntryDTO, toJournalEntryDTO } from '@/lib/domain/journal';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';
import { withApiHandler, successResponse } from '@/lib/api-handler';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    return withApiHandler(async (req) => {
      const session = await getServerSession(authOptions);
      const client = await clientPromise;
      const db = client.db('serene-mind');

      const entries = await db.collection('journal')
        .find({ userId: session!.user!.id })
        .sort({ date: -1 })
        .toArray();

      const entryDTOs: JournalEntryDTO[] = entries.map(entry => ({
        id: entry._id.toString(),
        date: entry.date.toISOString(),
        mood: entry.mood,
        content: entry.content,
      }));

      return successResponse(entryDTOs);
    })(request);
  }, rateLimitConfig.journal);
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req) => {
    return withApiHandler(async (r) => {
      const session = await getServerSession(authOptions);
      const body = await r.json();
      
      const entry = CreateJournalEntrySchema.parse(body);
      const client = await clientPromise;
      const db = client.db('serene-mind');

      const entryDoc = {
        ...entry,
        userId: session!.user!.id,
        createdAt: new Date(),
      };

      const result = await db.collection('journal').insertOne(entryDoc);

      const createdEntry: JournalEntryDTO = {
        id: result.insertedId.toString(),
        date: entry.date.toISOString(),
        mood: entry.mood,
        content: entry.content,
      };

      return successResponse(createdEntry, 201);
    })(req);
  }, rateLimitConfig.journal);
}
