import { NextRequest } from 'next/server';
import { getDatabase } from '@/lib/db-init';
import type { Achievement } from '@/lib/domain/achievement';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimitConfig } from '@/lib/rate-limit';
import { withApiHandler, successResponse } from '@/lib/api-handler';
import type { Session } from 'next-auth';

/**
 * Removed: 'Task Master' (competitive framing, completion pressure)
 * Removed: 'Mindful Streak' (7 consecutive days — punitive streak mechanic)
 * Removed: '3-Day Streak' demo achievement
 *
 * Reframed: all remaining achievements use neutral, non-competitive language.
 * Unlock conditions are cumulative (not consecutive) to avoid failure states.
 *
 * New: 'Kept Going' replaces 'Task Master' — higher bar, zero competitive framing.
 */
const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'First Step',
    description: 'You completed a task. That is what starting looks like.',
    unlocked: false,
    icon: 'Star',
  },
  {
    id: '2',
    title: 'First Reflection',
    description: 'You wrote your first journal entry.',
    unlocked: false,
    icon: 'BookOpen',
  },
  {
    id: '4',
    title: 'Returning Writer',
    description: 'You have written at least 3 journal entries across any days.',
    unlocked: false,
    icon: 'CalendarCheck2',
  },
  {
    id: '6',
    title: 'Mood Check-in',
    description: 'You have logged 10 mood check-ins.',
    unlocked: false,
    icon: 'BookOpen',
  },
  {
    id: '7',
    title: 'Kept Going',
    description: 'You have completed 10 tasks across any number of sessions.',
    unlocked: false,
    icon: 'Award',
  },
];

export async function GET(request: NextRequest) {
  return withRateLimit(request, async (req, session) => {
    return withApiHandler(async () => {
      const db = await getDatabase();
      const userId = (session as Session).user.id;

      const [tasksCount, journalCount] = await Promise.all([
        db.collection('tasks').countDocuments({ userId, completed: true }),
        db.collection('journal').countDocuments({ userId }),
      ]);

      const updatedAchievements = ACHIEVEMENTS.map(achievement => {
        let unlocked = false;
        switch (achievement.id) {
          case '1': unlocked = tasksCount >= 1;  break;
          case '2': unlocked = journalCount >= 1; break;
          case '4': unlocked = journalCount >= 3; break;  // cumulative, not consecutive
          case '6': unlocked = journalCount >= 10; break;
          case '7': unlocked = tasksCount >= 10; break;   // replaced Task Master (5)
        }
        return { ...achievement, unlocked };
      });

      // Neutral metric: actions = tasks completed + journal entries
      // No "points" concept, no streak pressure
      const actionsCount = tasksCount + journalCount;

      return successResponse({
        achievements: updatedAchievements,
        stats: {
          tasksCompleted: tasksCount,
          journalEntries: journalCount,
          actionsCount,
          // streakDays intentionally omitted — no streak mechanics in this system
        },
      });
    }, { session })(req);
  }, rateLimitConfig.rewards);
}
