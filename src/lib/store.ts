import { create } from 'zustand';
import type { Task, JournalEntry, Achievement, Subtask } from './types';
import { MOCK_TASKS, MOCK_JOURNAL_ENTRIES, MOCK_ACHIEVEMENTS } from './data';
import { fromTaskDTO } from './domain/task';
import { fromJournalEntryDTO } from './domain/journal';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => Promise<void>;
  addSubtasks: (taskId: string, subtasks: Subtask[]) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const taskDTOs = await response.json();
      const tasks = taskDTOs.map(fromTaskDTO);
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  addTask: async (task) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      await get().fetchTasks(); // Refresh tasks
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
  toggleTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
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
