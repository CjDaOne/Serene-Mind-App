import { computeSystemState } from './stateEngine';
import { selectTasks } from './taskSelector';
import type { Task, UserStateInput, SystemState } from './types';

export type { Task, UserStateInput, SystemState, TaskMetrics, UserSystemMode } from './types';
export { RE_ENTRY_THRESHOLD_MS, MODE_HIERARCHY } from './constants';

// Everything external calls ONLY this function.
export function getSystemView(
  tasks: Task[],
  userState: UserStateInput
): {
  systemState: SystemState;
  tasks: Task[];
} {
  const systemState = computeSystemState(userState);
  const visibleTasks = selectTasks(tasks, systemState);

  return {
    systemState,
    tasks: visibleTasks,
  };
}
