import type { UserSystemMode } from './types';

export const RE_ENTRY_THRESHOLD_MS = 72 * 60 * 60 * 1000; // 72 hours

export const MODE_HIERARCHY: Record<UserSystemMode, number> = {
  SURVIVE: 0,
  STABILIZE: 1,
  PRODUCTIVE: 2,
};
