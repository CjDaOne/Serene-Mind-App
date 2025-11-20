'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Task, JournalEntry, Mood, Achievement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getAchievementIcon } from '@/components/icons';
import { NotificationManager } from '@/components/notification-manager';
import { fromTaskDTO } from '@/lib/domain/task';
import { fromJournalEntryDTO } from '@/lib/domain/journal';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { getDemoTasks, getDemoJournalEntries, getDemoAchievements } from '@/lib/demo-data';
import { GuestBanner } from '@/components/guest-banner';

const moodVerbiage: Record<Mood, string> = {
  Happy: 'feeling happy',
  Calm: 'feeling calm',
  Sad: 'feeling sad',
  Anxious: 'feeling anxious',
  Excited: 'feeling excited',
};


export default function DashboardClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.isGuest) {
        setTasks(getDemoTasks());
        setJournalEntries(getDemoJournalEntries());
        setAchievements(getDemoAchievements());
        return;
      }

      setLoading(true);
      try {
        const [tasksRes, journalRes, rewardsRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/journal'),
          fetch('/api/rewards'),
        ]);

        if (tasksRes.ok) {
          const taskDTOs = await tasksRes.json();
          setTasks(taskDTOs.map(fromTaskDTO));
        }

        if (journalRes.ok) {
          const entryDTOs = await journalRes.json();
          setJournalEntries(entryDTOs.map(fromJournalEntryDTO));
        }

        if (rewardsRes.ok) {
          const data = await rewardsRes.json();
          setAchievements(data.achievements);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load dashboard data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const todaysTasks = tasks.filter(task => {
    const today = new Date();
    return task.dueDate.getDate() === today.getDate() &&
      task.dueDate.getMonth() === today.getMonth() &&
      task.dueDate.getFullYear() === today.getFullYear() &&
      !task.completed
  });

  const latestJournal = journalEntries.length > 0 ? journalEntries[0] : null;

  return (
    <div className="flex flex-col gap-8">
      {session?.user?.isGuest && <GuestBanner />}

      <div className="text-center bg-gradient-to-r from-primary to-primary/70 text-primary-foreground p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold font-headline">Hello, Wellness Seeker!</h1>
        <p className="text-lg mt-2 text-primary-foreground/80">&quot;Every day is a new opportunity to grow.&quot;</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Focus Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysTasks.length > 0 ? (
              todaysTasks.slice(0, 3).map(task => (
                <div key={task.id} className="mb-2">
                  <p className="font-medium">{task.title}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No tasks scheduled for today. Time to relax or add some!</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 h-auto">
              <Link href="/tasks">View All Tasks</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Mood Today</CardTitle>
          </CardHeader>
          <CardContent>
            {latestJournal ? (
              <div>
                <p className="text-muted-foreground">You last reported {moodVerbiage[latestJournal.mood]}.</p>
                <p className="font-semibold mt-2">Recent Moods:</p>
                <div className="flex gap-2 mt-1">
                  {journalEntries.slice(0, 5).map(entry => (
                    <span key={entry.id} className="text-xs p-1 px-2 bg-secondary rounded-full">{entry.mood}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No mood logged today.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 h-auto">
              <Link href="/journal">Log Mood / View Journal</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reflections</CardTitle>
          </CardHeader>
          <CardContent>
            {journalEntries.length > 0 ? (
              <p className="text-muted-foreground italic">&quot;{journalEntries[0].content}&quot;</p>
            ) : (
              <p className="text-muted-foreground">No journal entries yet. Start reflecting today!</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="default" className="bg-accent hover:bg-accent/90">
              <Link href="/journal">Add New Entry</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
            <CardDescription>Celebrate your progress!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.filter(a => a.unlocked).map(achievement => {
                const Icon = getAchievementIcon(achievement.icon);
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Icon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
              {achievements.filter(a => !a.unlocked).length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg opacity-50">
                  {(() => {
                    const nextAchievement = achievements.find(a => !a.unlocked);
                    if (nextAchievement) {
                      const Icon = getAchievementIcon(nextAchievement.icon);
                      return <Icon className="w-8 h-8 text-muted-foreground" />;
                    }
                    return null;
                  })()}
                  <div>
                    <p className="font-medium text-sm">Next Achievement</p>
                    <p className="text-xs text-muted-foreground">Keep going!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 h-auto">
              <Link href="/rewards">View All Achievements</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <NotificationManager />
        </div>
      </div>
    </div>
  );
}
