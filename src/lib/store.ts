import { create } from 'zustand';
import type { Task, JournalEntry, Achievement, Subtask } from './types';
import { MOCK_TASKS, MOCK_JOURNAL_ENTRIES, MOCK_ACHIEVEMENTS } from './data';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  addSubtasks: (taskId: string, subtasks: Subtask[]) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: MOCK_TASKS,
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }],
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),
  updateSubtask: (taskId, subtaskId, completed) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed } : st
              ),
            }
          : t
      ),
    })),
  addSubtasks: (taskId, subtasks) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, ...subtasks] } : t
      ),
    })),
}));

interface JournalStore {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
}

export const useJournalStore = create<JournalStore>((set) => ({
  entries: MOCK_JOURNAL_ENTRIES,
  addEntry: (entry) =>
    set((state) => ({
      entries: [{ ...entry, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }, ...state.entries],
    })),
}));

interface AchievementStore {
  achievements: Achievement[];
  updateAchievements: (tasks: Task[], entries: JournalEntry[]) => void;
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  achievements: MOCK_ACHIEVEMENTS,
  updateAchievements: (tasks, entries) => {
    const completedTasks = tasks.filter((t) => t.completed).length;
    const journalCount = entries.length;
    set((state) => ({
      achievements: state.achievements.map((ach) => {
        if (ach.id === '1' && completedTasks > 0) return { ...ach, unlocked: true };
        if (ach.id === '2' && journalCount > 0) return { ...ach, unlocked: true };
        if (ach.id === '3' && completedTasks >= 5) return { ...ach, unlocked: true };
        if (ach.id === '4' && journalCount >= 3) return { ...ach, unlocked: true };
        return ach;
      }),
    }));
  },
}));
