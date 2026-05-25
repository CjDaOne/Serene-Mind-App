// Core domain types — no UI, no DB, no API dependencies

export type UserSystemMode = 'SURVIVE' | 'STABILIZE' | 'PRODUCTIVE';

export interface TaskMetrics {
  cognitiveLoad: 1 | 2 | 3 | 4 | 5;
  emotionalFriction: 1 | 2 | 3 | 4 | 5;
  energyDemand: 1 | 2 | 3 | 4 | 5;
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  metrics: TaskMetrics;
  createdAt: number;
}

export interface UserStateInput {
  lastActiveAt: number;
  currentMode: UserSystemMode;
}

export interface SystemState {
  mode: UserSystemMode;
  reEntryMode: boolean;
  inactiveDurationMs: number;
  capacity: number; // 0.0 → 1.0
}
