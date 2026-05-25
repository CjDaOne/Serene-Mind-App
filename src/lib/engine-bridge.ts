/**
 * Bridges between the app's full Task type and the core engine's lean Task type.
 * The core engine only needs what it needs to score and filter.
 * App tasks carry extra fields (description, subtasks, priority, dueDate)
 * that the engine deliberately knows nothing about.
 */
import type { Task as AppTask } from '@/lib/domain/task';
import type { Task as EngineTask } from '@/core/index';

export function toEngineTask(task: AppTask): EngineTask {
  return {
    id: task.id,
    title: task.title,
    isCompleted: task.completed,
    metrics: task.metrics,
    createdAt: task.createdAt?.getTime() ?? Date.now(),
  };
}

/**
 * After the engine returns its ordered, filtered list of IDs,
 * re-hydrate those IDs into full app tasks in engine-determined order.
 */
export function applyEngineFilter(
  appTasks: AppTask[],
  engineTasks: EngineTask[]
): AppTask[] {
  const taskMap = new Map(appTasks.map(t => [t.id, t]));
  return engineTasks
    .map(et => taskMap.get(et.id))
    .filter((t): t is AppTask => t !== undefined);
}
