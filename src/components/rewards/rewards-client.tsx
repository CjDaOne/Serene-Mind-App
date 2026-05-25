'use client';

import { useState, useEffect } from 'react';
import type { Achievement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { getAchievementIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { getDemoAchievements } from '@/lib/demo-data';

interface Stats {
  tasksCompleted: number;
  journalEntries: number;
  actionsCount: number;
  // streakDays intentionally absent
}

export default function RewardsClient() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stats>({
    tasksCompleted: 0,
    journalEntries: 0,
    actionsCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAchievements = async () => {
      if (session?.user?.isGuest) {
        setAchievements(getDemoAchievements());
        setStats({ tasksCompleted: 1, journalEntries: 3, actionsCount: 4 });
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/rewards');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setAchievements(data.achievements);
        setStats(data.stats);
      } catch {
        toast({ title: 'Error', description: 'Failed to load', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [session]);

  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Progress</h1>
        <p className="text-muted-foreground">Things you&apos;ve done, recorded without judgment.</p>
      </div>

      {/* Actions count — neutral framing, no trophy/points/leaderboard */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{stats.actionsCount}</p>
            <p className="text-sm text-muted-foreground mt-1">Total actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats.tasksCompleted}</p>
            <p className="text-sm text-muted-foreground mt-1">Tasks completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{stats.journalEntries}</p>
            <p className="text-sm text-muted-foreground mt-1">Journal entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked first, then locked — no progress bar pushing completion anxiety */}
      {unlocked.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Things that happened</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {unlocked.map(ach => {
              const Icon = getAchievementIcon(ach.icon);
              return (
                <Card key={ach.id} className="border-primary/20 bg-primary/5">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {ach.title}
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{ach.description}</p>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Others that may happen</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {locked.map(ach => {
              const Icon = getAchievementIcon(ach.icon);
              return (
                <Card key={ach.id} className="opacity-40">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{ach.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{ach.description}</p>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
