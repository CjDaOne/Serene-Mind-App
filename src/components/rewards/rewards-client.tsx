'use client';

import { useState, useEffect } from 'react';
import type { Achievement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '../ui/progress';
import { Trophy } from 'lucide-react';
import { getAchievementIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function RewardsClient() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    journalEntries: 0,
    totalPoints: 0,
    streakDays: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rewards');
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const data = await response.json();
      setAchievements(data.achievements);
      setStats(data.stats);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load rewards', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const totalAchievements = achievements.length;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

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
          <span>{stats.totalPoints}</span>
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
          {achievements.map(ach => {
                const Icon = getAchievementIcon(ach.icon);
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
