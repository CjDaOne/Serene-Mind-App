import type { Task, JournalEntry, Achievement } from './types';

export function getDemoTasks(): Task[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: 'demo-task-1',
      title: '🎉 Welcome to Serene Mind!',
      description: 'You\'ve completed your first task! Explore the app to discover more features like journaling, calendar, and achievements.',
      completed: true,
      dueDate: now,
      subtasks: [],
      priority: 'Medium' as const,
    },
    {
      id: 'demo-task-2',
      title: '🧘 Morning Meditation',
      description: 'Start your day with 10 minutes of mindful breathing. Try the box breathing technique: inhale for 4 counts, hold for 4, exhale for 4, hold for 4.',
      completed: false,
      dueDate: tomorrow,
      subtasks: [
        {
          id: 'demo-subtask-1',
          title: 'Find a quiet space',
          completed: true,
        },
        {
          id: 'demo-subtask-2',
          title: 'Complete 10-minute session',
          completed: false,
        },
      ],
      priority: 'High' as const,
    },
    {
      id: 'demo-task-3',
      title: '📝 Journal Reflection',
      description: 'Spend 5 minutes writing about your thoughts and feelings. Check the Journal tab to see example entries!',
      completed: false,
      dueDate: now,
      subtasks: [],
      priority: 'High' as const,
    },
    {
      id: 'demo-task-4',
      title: '💆 Self-Care Activity',
      description: 'Take a relaxing bath, go for a walk, or do something that brings you joy. Self-care isn\'t selfish—it\'s essential.',
      completed: false,
      dueDate: tomorrow,
      subtasks: [],
      priority: 'Medium' as const,
    },
    {
      id: 'demo-task-5',
      title: '🎯 Weekly Goal: Practice Gratitude',
      description: 'Each day, write down three things you\'re grateful for. This simple practice can significantly improve your mood and outlook.',
      completed: false,
      dueDate: nextWeek,
      subtasks: [],
      priority: 'Low' as const,
    },
  ];
}

export function getDemoJournalEntries(): JournalEntry[] {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  return [
    {
      id: 'demo-journal-1',
      date: yesterday,
      mood: 'Calm' as const,
      content: 'Today was a peaceful day. I took time for myself this morning with a short meditation, and it really set a positive tone for the rest of the day. I\'m learning that taking care of my mental health doesn\'t have to be complicated—sometimes it\'s just about showing up for myself, even in small ways. Feeling grateful for this journey of self-discovery.',
    },
    {
      id: 'demo-journal-2',
      date: twoDaysAgo,
      mood: 'Happy' as const,
      content: 'Had a wonderful conversation with a friend today that reminded me how important human connection is. We laughed, shared stories, and supported each other. It made me realize that I\'m not alone in my struggles. Three things I\'m grateful for today:\n\n1. Supportive friendships\n2. The ability to laugh even on difficult days\n3. This app for helping me track my wellness journey',
    },
    {
      id: 'demo-journal-3',
      date: threeDaysAgo,
      mood: 'Anxious' as const,
      content: 'Feeling overwhelmed with everything on my plate lately. Work has been stressful, and I\'m worried about keeping up with everything. But I\'m trying to remember what my therapist said: I can only control what I can control.\n\nCoping strategies I used today:\n- Deep breathing when I felt tension building\n- Taking a 15-minute walk outside\n- Breaking big tasks into smaller, manageable steps\n- Reaching out to a friend instead of isolating\n\nTomorrow is a new day. I\'m doing my best, and that\'s enough.',
    },
  ];
}

export function getDemoAchievements(): Achievement[] {
  return [
    {
      id: 'demo-achievement-1',
      title: 'First Task Completed',
      description: 'You\'ve completed your first task! Every journey begins with a single step.',
      unlocked: true,
      icon: 'Star' as const,
    },
    {
      id: 'demo-achievement-2',
      title: 'First Journal Entry',
      description: 'You\'ve started your journaling journey. Writing helps process emotions and track your growth.',
      unlocked: true,
      icon: 'BookOpen' as const,
    },
    {
      id: 'demo-achievement-3',
      title: '3-Day Streak',
      description: 'Complete tasks for 3 days in a row. Consistency is the key to building lasting habits!',
      unlocked: false,
      icon: 'CalendarCheck2' as const,
    },
    {
      id: 'demo-achievement-4',
      title: 'Mindfulness Master',
      description: 'Complete 10 meditation or mindfulness tasks. Your dedication to inner peace is inspiring!',
      unlocked: false,
      icon: 'Award' as const,
    },
  ];
}
