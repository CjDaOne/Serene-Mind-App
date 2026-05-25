import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db-init';
import { CreateJournalEntrySchema, JournalEntryDTO } from '@/lib/domain/journal';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';
import { withApiHandler, successResponse } from '@/lib/api-handler';
import type { Session } from 'next-auth';

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async () => {
      const db = await getDatabase();

      const entries = await db.collection('journal')
        .find({ userId: (session as Session).user.id })
        .sort({ date: -1 })
        .toArray();

      const entryDTOs: JournalEntryDTO[] = entries.map(entry => ({
        id: entry._id.toString(),
        date: entry.date.toISOString(),
        mood: entry.mood,
        content: entry.content,
      }));

      return successResponse(entryDTOs);
    }, { session })(req);
  }, rateLimitConfig.journal);
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async (r) => {
      const body = await r.json();
      const entry = CreateJournalEntrySchema.parse(body);
      const db = await getDatabase();

      const entryDoc = {
        ...entry,
        userId: (session as Session).user.id,
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
    }, { session })(req);
  }, rateLimitConfig.journal);
}
