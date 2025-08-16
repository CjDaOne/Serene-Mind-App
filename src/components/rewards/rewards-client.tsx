'use client';

import { useState, useMemo } from 'react';
import { MOCK_TASKS, MOCK_JOURNAL_ENTRIES, MOCK_ACHIEVEMENTS } from '@/lib/data';
import type { Task, JournalEntry, Achievement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '../ui/progress';
import { Trophy } from 'lucide-react';

export default function RewardsClient() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);

  const wellnessPoints = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const journalCount = journalEntries.length;
    return (completedTasks * 10) + (journalCount * 5);
  }, [tasks, journalEntries]);

  // This is a simplified logic for achievements.
  // In a real app, this would be more robust.
  const unlockedAchievements = useMemo(() => {
    const completedTaskCount = tasks.filter(t => t.completed).length;
    return achievements.map(ach => {
      if (ach.id === '1' && completedTaskCount > 0) return { ...ach, unlocked: true };
      if (ach.id === '2' && journalEntries.length > 0) return { ...ach, unlocked: true };
      if (ach.id === '3' && completedTaskCount >= 5) return { ...ach, unlocked: true };
      if (ach.id === '4' && journalEntries.length >= 3) return { ...ach, unlocked: true };
      return ach;
    });
  }, [tasks, journalEntries, achievements]);

  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedCount / totalAchievements) * 100;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Rewards & Progress</h1>
        <p className="text-muted-foreground">Celebrate your journey to wellness.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Wellness Points</h3>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Trophy className="w-6 h-6" />
              <span>{wellnessPoints}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <p>Achievements Unlocked</p>
                <p>{unlockedCount} of {totalAchievements}</p>
            </div>
            <Progress value={progressPercentage} />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline">Achievements</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {unlockedAchievements.map(ach => {
                const Icon = ach.icon;
                return (
                    <Card key={ach.id} className={`transition-all ${ach.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className={`p-3 rounded-lg ${ach.unlocked ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                                <Icon className="w-8 h-8"/>
                            </div>
                            <div>
                                <CardTitle>{ach.title}</CardTitle>
                                <CardDescription>{ach.description}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                )
            })}
          </div>
      </div>
    </div>
  );
}
