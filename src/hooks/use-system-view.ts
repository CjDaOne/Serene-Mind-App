'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getSystemView } from '@/core/index';
import type { SystemState, UserSystemMode } from '@/core/index';
import type { Task } from '@/lib/domain/task';
import { fromTaskDTO } from '@/lib/domain/task';
import { toEngineTask, applyEngineFilter } from '@/lib/engine-bridge';
import { getDemoTasks } from '@/lib/demo-data';

interface SystemView {
  systemState: SystemState | null;
  // Engine-filtered, scored, ordered tasks for display
  visibleTasks: Task[];
  // Complete unfiltered task list (for management/CRUD views)
  allTasks: Task[];
  loading: boolean;
  error: string | null;
  setMode: (mode: UserSystemMode) => Promise<void>;
  refetch: () => void;
}

const GUEST_USER_STATE = {
  lastActiveAt: Date.now(),
  currentMode: 'STABILIZE' as const,
};

export function useSystemView(): SystemView {
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: session } = useSession();
  const hasFetched = useRef(false);

  const fetchAndCompute = useCallback(async () => {
    if (!session?.user) return;

    setLoading(true);
    setError(null);

    try {
      if (session.user.isGuest) {
        const demoTasks = getDemoTasks();
        const { systemState: state, tasks: engineTasks } = getSystemView(
          demoTasks.map(toEngineTask),
          GUEST_USER_STATE
        );
        setSystemState(state);
        setVisibleTasks(applyEngineFilter(demoTasks, engineTasks));
        setAllTasks(demoTasks);
        return;
      }

      // Fetch tasks and user state in parallel
      // POST to user-state updates lastActiveAt server-side and returns
      // the PREVIOUS lastActiveAt for accurate inactivity computation
      const [tasksRes, userStateRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/user-state', { method: 'POST' }),
      ]);

      if (!tasksRes.ok || !userStateRes.ok) {
        throw new Error('Failed to load data');
      }

      const taskDTOs = await tasksRes.json();
      const userState = await userStateRes.json();

      const appTasks: Task[] = taskDTOs.map(fromTaskDTO);

      // Core engine runs on the client — pure function, no side effects
      const { systemState: state, tasks: engineTasks } = getSystemView(
        appTasks.map(toEngineTask),
        userState
      );

      setSystemState(state);
      setVisibleTasks(applyEngineFilter(appTasks, engineTasks));
      setAllTasks(appTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, refreshTrigger]);

  useEffect(() => {
    fetchAndCompute();
  }, [fetchAndCompute]);

  const setMode = useCallback(async (mode: UserSystemMode) => {
    if (session?.user?.isGuest) return;

    await fetch('/api/user-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentMode: mode }),
    });

    // Recompute locally with new mode — no refetch needed for mode changes
    // (lastActiveAt hasn't changed, only the mode preference)
    if (systemState) {
      setSystemState(prev => prev ? {
        ...prev,
        mode: prev.reEntryMode ? 'SURVIVE' : mode,
      } : prev);
    }
  }, [session?.user?.isGuest, systemState]);

  const refetch = useCallback(() => {
    setRefreshTrigger(n => n + 1);
  }, []);

  return { systemState, visibleTasks, allTasks, loading, error, setMode, refetch };
}
