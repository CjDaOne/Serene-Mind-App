import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { AchievementSchema, Achievement } from '@/lib/domain/achievement';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'First Task Completed',
    description: 'You completed your very first task!',
    unlocked: false,
    icon: 'Star',
  },
  {
    id: '2',
    title: 'Journal Entry',
    description: 'You wrote your first journal entry.',
    unlocked: false,
    icon: 'BookOpen',
  },
  {
    id: '3',
    title: 'Task Master',
    description: 'Complete 5 tasks.',
    unlocked: false,
    icon: 'Award',
  },
  {
    id: '4',
    title: 'Consistent Journalist',
    description: 'Write in your journal for 3 days.',
    unlocked: false,
    icon: 'CalendarCheck2',
  },
  {
    id: '5',
    title: 'Mindful Streak',
    description: 'Complete tasks for 7 consecutive days.',
    unlocked: false,
    icon: 'Star',
  },
  {
    id: '6',
    title: 'Emotion Explorer',
    description: 'Log 10 different mood entries.',
    unlocked: false,
    icon: 'BookOpen',
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('serene-mind');

    // Get user stats
    const tasksCount = await db.collection('tasks').countDocuments({
      userId: session.user.id,
      completed: true,
    });

    const journalCount = await db.collection('journal').countDocuments({
      userId: session.user.id,
    });

    const completedTasks = await db.collection('tasks')
      .find({ userId: session.user.id, completed: true })
      .sort({ updatedAt: -1 })
      .toArray();

    // Check for streaks (simplified - would need more complex logic for real streaks)
    const uniqueDates = [...new Set(
      completedTasks.map(task =>
        new Date(task.updatedAt).toDateString()
      )
    )];

    // Update achievements based on stats
    const updatedAchievements = ACHIEVEMENTS.map(achievement => {
      let unlocked = false;

      switch (achievement.id) {
        case '1':
          unlocked = tasksCount >= 1;
          break;
        case '2':
          unlocked = journalCount >= 1;
          break;
        case '3':
          unlocked = tasksCount >= 5;
          break;
        case '4':
          unlocked = journalCount >= 3;
          break;
        case '5':
          unlocked = uniqueDates.length >= 7;
          break;
        case '6':
          // This would need to check distinct moods, simplified for now
          unlocked = journalCount >= 10;
          break;
      }

      return { ...achievement, unlocked };
    });

    const totalPoints = (tasksCount * 10) + (journalCount * 5);

    return NextResponse.json({
      achievements: updatedAchievements,
      stats: {
        tasksCompleted: tasksCount,
        journalEntries: journalCount,
        totalPoints,
        streakDays: uniqueDates.length,
      },
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
