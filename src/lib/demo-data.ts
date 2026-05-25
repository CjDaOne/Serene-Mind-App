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
      title: 'Welcome to SereneMind',
      description: 'You\'ve arrived. That counts.',
      completed: true,
      dueDate: now,
      subtasks: [],
      priority: 'Low' as const,
      metrics: { cognitiveLoad: 1, emotionalFriction: 1, energyDemand: 1 },
    },
    {
      id: 'demo-task-2',
      title: 'Morning breathing — 5 minutes',
      description: 'Sit somewhere comfortable. Breathe in for 4 counts, out for 4.',
      completed: false,
      dueDate: tomorrow,
      subtasks: [
        { id: 'demo-subtask-1', title: 'Find a quiet space', completed: true },
        { id: 'demo-subtask-2', title: 'Sit for 5 minutes', completed: false },
      ],
      priority: 'Low' as const,
      // Low load tasks — engine surfaces these first in re-entry/survive mode
      metrics: { cognitiveLoad: 1, emotionalFriction: 1, energyDemand: 2 },
    },
    {
      id: 'demo-task-3',
      title: 'Write one sentence in your journal',
      description: 'It can be anything. One sentence is enough.',
      completed: false,
      dueDate: now,
      subtasks: [],
      priority: 'Low' as const,
      metrics: { cognitiveLoad: 2, emotionalFriction: 2, energyDemand: 1 },
    },
    {
      id: 'demo-task-4',
      title: 'Go outside for 10 minutes',
      description: 'No goal, no destination. Just outside.',
      completed: false,
      dueDate: tomorrow,
      subtasks: [],
      priority: 'Medium' as const,
      metrics: { cognitiveLoad: 1, emotionalFriction: 2, energyDemand: 2 },
    },
    {
      id: 'demo-task-5',
      title: 'Review weekly goals',
      description: 'Look at the week ahead and decide what matters.',
      completed: false,
      dueDate: nextWeek,
      subtasks: [],
      priority: 'Medium' as const,
      // Higher load — engine holds this back during survive/stabilize modes
      metrics: { cognitiveLoad: 4, emotionalFriction: 3, energyDemand: 3 },
    },
  ];
}

export function getDemoJournalEntries(): JournalEntry[] {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return [
    {
      id: 'demo-journal-1',
      date: yesterday,
      mood: 'Calm' as const,
      content: 'Took things slowly today. Made one small decision and it was enough.',
    },
    {
      id: 'demo-journal-2',
      date: twoDaysAgo,
      mood: 'Happy' as const,
      content: 'Talked to someone I trust. It helped more than I expected.',
    },
  ];
}

export function getDemoAchievements(): Achievement[] {
  return [
    {
      id: '1',
      title: 'First Step',
      description: 'You completed a task. That is what starting looks like.',
      unlocked: true,
      icon: 'Star' as const,
    },
    {
      id: '2',
      title: 'First Reflection',
      description: 'You wrote your first journal entry.',
      unlocked: true,
      icon: 'BookOpen' as const,
    },
    {
      id: '4',
      title: 'Returning Writer',
      description: 'You have written at least 3 journal entries across any days.',
      unlocked: false,
      icon: 'CalendarCheck2' as const,
    },
    {
      id: '7',
      title: 'Kept Going',
      description: 'You have completed 10 tasks across any number of sessions.',
      unlocked: false,
      icon: 'Award' as const,
    },
  ];
}
