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
  updateSubtask: async (taskId, subtaskId, completed) => {
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
    }));
  },
  addSubtasks: async (taskId, subtasks) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, subtasks: [...t.subtasks, ...subtasks] } : t
      ),
    }));
  },
}));

interface JournalStore {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  fetchEntries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/journal');
      if (!response.ok) {
        throw new Error('Failed to fetch journal entries');
      }
      const entryDTOs = await response.json();
      const entries = entryDTOs.map(fromJournalEntryDTO);
      set({ entries, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  addEntry: async (entry) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) {
        throw new Error('Failed to add journal entry');
      }
      await get().fetchEntries(); // Refresh entries
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
}));

interface AchievementStore {
  achievements: Achievement[];
  stats: {
    tasksCompleted: number;
    journalEntries: number;
    totalPoints: number;
    streakDays: number;
  };
  loading: boolean;
  error: string | null;
  fetchAchievements: () => Promise<void>;
}

export const useAchievementStore = create<AchievementStore>((set) => ({
  achievements: [],
  stats: {
    tasksCompleted: 0,
    journalEntries: 0,
    totalPoints: 0,
    streakDays: 0,
  },
  loading: false,
  error: null,

  fetchAchievements: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/rewards');
      if (!response.ok) {
        throw new Error('Failed to fetch achievements');
      }
      const data = await response.json();
      set({
        achievements: data.achievements,
        stats: data.stats,
        loading: false
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },
}));
