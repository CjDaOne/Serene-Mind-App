import type { SystemState, UserStateInput } from './types';
import { RE_ENTRY_THRESHOLD_MS } from './constants';

// ONLY place system state is computed.
// Same input always produces same output.
export function computeSystemState(input: UserStateInput): SystemState {
  const now = Date.now();
  const inactiveDurationMs = now - input.lastActiveAt;

  const reEntryMode = inactiveDurationMs >= RE_ENTRY_THRESHOLD_MS;

  // Re-entry forces SURVIVE regardless of saved mode
  const mode = reEntryMode ? 'SURVIVE' : input.currentMode;

  const capacity = computeCapacity(inactiveDurationMs, reEntryMode);

  return {
    mode,
    reEntryMode,
    inactiveDurationMs,
    capacity,
  };
}

function computeCapacity(inactiveMs: number, reEntry: boolean): number {
  if (!reEntry) return 1.0;

  // Decay curve: longer inactivity → lower capacity floor
  const ratio = inactiveMs / (RE_ENTRY_THRESHOLD_MS * 2);
  return Math.max(0.2, 1 - ratio);
}
