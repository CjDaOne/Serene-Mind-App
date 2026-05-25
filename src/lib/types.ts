// Legacy re-exports — prefer importing from @/lib/domain/* directly in new code
export type { Task, Subtask, Priority, TaskMetrics } from './domain/task';
export type { JournalEntry, Mood } from './domain/journal';
export type { Achievement, IconName } from './domain/achievement';
