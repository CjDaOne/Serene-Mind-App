import type { Task, TaskMetrics } from './types';

// No DB, no mutation, no side effects.
export function computeTaskScore(metrics: TaskMetrics): number {
  return (
    metrics.cognitiveLoad * 0.4 +
    metrics.emotionalFriction * 0.4 +
    metrics.energyDemand * 0.2
  );
}

export function enrichTask(task: Task): Task & { score: number } {
  return {
    ...task,
    score: computeTaskScore(task.metrics),
  };
}
