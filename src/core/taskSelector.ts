import type { Task, SystemState } from './types';
import { enrichTask } from './taskScoring';

// This is where product behavior lives.
// All filtering, ordering, and capacity logic lives here and nowhere else.
export function selectTasks(tasks: Task[], state: SystemState): Task[] {
  const enriched = tasks
    .filter(t => !t.isCompleted)
    .map(enrichTask);

  if (state.reEntryMode || state.mode === 'SURVIVE') {
    return enriched
      .filter(t => t.metrics.emotionalFriction <= 2)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }

  if (state.mode === 'STABILIZE') {
    return enriched
      .filter(t => t.metrics.cognitiveLoad <= 4)
      .sort((a, b) => a.score - b.score)
      .slice(0, 7);
  }

  // PRODUCTIVE: all tasks, highest-demand first
  return enriched.sort((a, b) => b.score - a.score);
}
