import type { LucideIcon } from 'lucide-react';

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Priority = "Low" | "Medium" | "High";

export type Task = {
  id:string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: Date;
  subtasks: Subtask[];
  priority: Priority;
};

export type Mood = "Happy" | "Calm" | "Sad" | "Anxious" | "Excited";

export type JournalEntry = {
  id: string;
  date: Date;
  mood: Mood;
  content: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: LucideIcon;
};
