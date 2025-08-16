import type { Task, JournalEntry, Achievement } from './types';
import { Award, BookOpen, CalendarCheck2, Star } from 'lucide-react';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Mindful Morning Routine',
    description: 'Start the day with 10 minutes of meditation.',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    subtasks: [
      { id: '1-1', title: 'Find a quiet space', completed: true },
      { id: '1-2', title: 'Choose a guided meditation', completed: false },
      { id: '1-3', title: 'Reflect on the session', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Digital Detox',
    description: 'Spend an hour away from all screens.',
    completed: true,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    subtasks: [],
  },
  {
    id: '3',
    title: 'Plan weekly goals',
    description: 'Outline key objectives for the upcoming week.',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    subtasks: [],
  },
    {
    id: '4',
    title: '30-minute workout',
    description: 'Engage in physical activity.',
    completed: false,
    dueDate: new Date(),
    subtasks: [
        { id: '4-1', title: 'Warm-up', completed: false },
        { id: '4-2', title: 'Main exercise', completed: false },
        { id: '4-3', title: 'Cool-down', completed: false },
    ],
  },
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    mood: 'Happy',
    content: 'Felt really productive today. The mindful morning routine helped a lot to center myself before starting work. I managed to finish a big project.',
  },
  {
    id: '2',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    mood: 'Anxious',
    content: 'Struggled with some anxiety about the upcoming presentation. The digital detox in the evening was a good way to disconnect and calm my nerves.',
  },
  {
    id: '3',
    date: new Date(),
    mood: 'Calm',
    content: 'Today was peaceful. I spent some time journaling and planning my week. Feeling prepared and calm about what\'s to come.',
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
    {
        id: '1',
        title: 'First Task Completed',
        description: 'You completed your very first task!',
        unlocked: true,
        icon: Star,
    },
    {
        id: '2',
        title: 'Journal Entry',
        description: 'You wrote your first journal entry.',
        unlocked: true,
        icon: BookOpen,
    },
    {
        id: '3',
        title: 'Task Master',
        description: 'Complete 5 tasks.',
        unlocked: false,
        icon: Award,
    },
    {
        id: '4',
        title: 'Consistent Journalist',
        description: 'Write in your journal for 3 days.',
        unlocked: true,
        icon: CalendarCheck2,
    }
]
