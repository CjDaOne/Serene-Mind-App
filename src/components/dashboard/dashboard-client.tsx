'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { NotificationManager } from '@/components/notification-manager';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useSystemView } from '@/hooks/use-system-view';
import { GuestBanner } from '@/components/guest-banner';
import type { UserSystemMode } from '@/core/index';
import type { Task } from '@/lib/domain/task';

const MODE_CONFIG: Record<UserSystemMode, { label: string; description: string }> = {
  SURVIVE:    { label: 'Getting through it',  description: 'One thing at a time. The rest can wait.' },
  STABILIZE:  { label: 'Building back',        description: 'Returning to routine, step by step.' },
  PRODUCTIVE: { label: 'Full capacity',         description: 'Ready to take on more.' },
};

function ModeSelector({
  current,
  onChange,
  disabled,
}: {
  current: UserSystemMode;
  onChange: (mode: UserSystemMode) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">How are you today?</p>
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(MODE_CONFIG) as UserSystemMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => !disabled && onChange(mode)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              current === mode
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {MODE_CONFIG[mode].label}
          </button>
        ))}
      </div>
      {current && (
        <p className="text-xs text-muted-foreground">{MODE_CONFIG[current].description}</p>
      )}
    </div>
  );
}

function FocusTaskItem({ task }: { task: Task }) {
  return (
    <div className="p-3 rounded-lg border bg-background">
      <p className="font-medium text-sm">{task.title}</p>
      {task.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
      )}
    </div>
  );
}

// Re-entry layout: structurally minimal — one task, one prompt, no backlog
function ReEntryView({
  daysSinceLastActive,
  suggestedTask,
  onReady,
}: {
  daysSinceLastActive: number;
  suggestedTask: Task | undefined;
  onReady: () => void;
}) {
  const days = Math.round(daysSinceLastActive);

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <div className="text-center pt-4">
        <h1 className="text-2xl font-semibold">Welcome back.</h1>
        <p className="text-muted-foreground mt-2">
          {days > 0
            ? `You've been away for ${days} day${days !== 1 ? 's' : ''}. No pressure.`
            : 'Starting fresh today.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">One thing to consider</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestedTask ? (
            <FocusTaskItem task={suggestedTask} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No tasks yet.{' '}
              <Link href="/tasks" className="underline">
                Add one when you&apos;re ready.
              </Link>
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={onReady} variant="default">
            I&apos;m ready to see more
          </Button>
          <Button asChild variant="ghost">
            <Link href="/journal">Just check in</Link>
          </Button>
        </CardFooter>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Your other tasks are still here. No backlog pressure.
      </p>
    </div>
  );
}

// Normal mode layout: mode selector + filtered focus tasks + mood + reflection
function NormalView({
  mode,
  visibleTasks,
  onModeChange,
  isGuest,
}: {
  mode: UserSystemMode;
  visibleTasks: Task[];
  onModeChange: (mode: UserSystemMode) => void;
  isGuest: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="pt-6">
          <ModeSelector current={mode} onChange={onModeChange} disabled={isGuest} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {visibleTasks.length > 0 ? (
            visibleTasks.map(task => <FocusTaskItem key={task.id} task={task} />)
          ) : (
            <p className="text-sm text-muted-foreground">
              No tasks match your current capacity. {' '}
              <Link href="/tasks" className="underline">
                Adjust or add tasks.
              </Link>
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/tasks">Manage all tasks</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Check in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A brief note about how you&apos;re feeling can help you see patterns over time.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="default">
              <Link href="/journal">Open journal</Link>
            </Button>
          </CardFooter>
        </Card>

        <div>
          <NotificationManager />
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const { data: session } = useSession();
  const { systemState, visibleTasks, loading, setMode } = useSystemView();
  const [reEntryAcknowledged, setReEntryAcknowledged] = useState(false);
  const { toast } = useToast();

  const handleModeChange = async (mode: UserSystemMode) => {
    try {
      await setMode(mode);
    } catch {
      toast({ title: 'Could not save mode', variant: 'destructive' });
    }
  };

  if (loading || !systemState) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  const showReEntry = systemState.reEntryMode && !reEntryAcknowledged;
  const daysSinceLastActive =
    systemState.inactiveDurationMs / (1000 * 60 * 60 * 24);

  return (
    <div className="flex flex-col gap-8">
      {session?.user?.isGuest && <GuestBanner />}

      {showReEntry ? (
        // Structurally different layout — reduced, no backlog, single task
        <ReEntryView
          daysSinceLastActive={daysSinceLastActive}
          suggestedTask={visibleTasks[0]}
          onReady={() => setReEntryAcknowledged(true)}
        />
      ) : (
        // Normal mode layout — includes mode selector and filtered task list
        <NormalView
          mode={systemState.mode}
          visibleTasks={visibleTasks}
          onModeChange={handleModeChange}
          isGuest={session?.user?.isGuest ?? false}
        />
      )}
    </div>
  );
}
