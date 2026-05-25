import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/lib/db-init';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';
import { withApiHandler, successResponse, errorResponse } from '@/lib/api-handler';
import type { UserStateInput, UserSystemMode } from '@/core/index';
import type { Session } from 'next-auth';

const UserSystemModeSchema = z.enum(['SURVIVE', 'STABILIZE', 'PRODUCTIVE']);

const DEFAULT_MODE: UserSystemMode = 'STABILIZE';

async function getUserPrefs(db: Awaited<ReturnType<typeof getDatabase>>, userId: string) {
  return db.collection('user_preferences').findOne({ userId });
}

// GET — return current state without mutating lastActiveAt
export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async () => {
      const db = await getDatabase();
      const userId = (session as Session).user.id;
      const prefs = await getUserPrefs(db, userId);

      const state: UserStateInput = {
        lastActiveAt: prefs?.lastActiveAt instanceof Date
          ? prefs.lastActiveAt.getTime()
          : Date.now(),
        currentMode: (prefs?.currentMode as UserSystemMode) ?? DEFAULT_MODE,
      };

      return successResponse(state);
    }, { session })(req);
  }, rateLimitConfig.default);
}

// POST — called on page load; updates lastActiveAt and returns state
// The engine uses the PRE-UPDATE lastActiveAt to compute re-entry correctly,
// then we update so the NEXT visit gets accurate inactivity measurement.
export async function POST(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async () => {
      const db = await getDatabase();
      const userId = (session as Session).user.id;
      const now = new Date();

      const prefs = await getUserPrefs(db, userId);

      const previousLastActiveAt: number = prefs?.lastActiveAt instanceof Date
        ? prefs.lastActiveAt.getTime()
        : Date.now();

      await db.collection('user_preferences').updateOne(
        { userId },
        {
          $set: { lastActiveAt: now },
          $setOnInsert: { currentMode: DEFAULT_MODE },
        },
        { upsert: true }
      );

      const state: UserStateInput = {
        // Return the PREVIOUS lastActiveAt so the engine can compute inactivity
        lastActiveAt: previousLastActiveAt,
        currentMode: (prefs?.currentMode as UserSystemMode) ?? DEFAULT_MODE,
      };

      return successResponse(state);
    }, { session })(req);
  }, rateLimitConfig.default);
}

// PUT — update currentMode only
export async function PUT(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async (r) => {
      const body = await r.json();
      const parsed = z.object({ currentMode: UserSystemModeSchema }).safeParse(body);

      if (!parsed.success) {
        return errorResponse('VALIDATION_ERROR', 'Invalid mode value', 400);
      }

      const db = await getDatabase();
      const userId = (session as Session).user.id;

      await db.collection('user_preferences').updateOne(
        { userId },
        { $set: { currentMode: parsed.data.currentMode } },
        { upsert: true }
      );

      return successResponse({ currentMode: parsed.data.currentMode });
    }, { session })(req);
  }, rateLimitConfig.default);
}
