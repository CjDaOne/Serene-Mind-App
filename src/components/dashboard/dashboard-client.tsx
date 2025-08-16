'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_TASKS, MOCK_JOURNAL_ENTRIES } from '@/lib/data';
import type { Task, JournalEntry, Mood } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';
import { ArrowRight, BarChart, Book, CheckCircle2, Smile, Frown, Meh, Annoyed, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';

const moodIcons: Record<Mood, React.ElementType> = {
  Happy: Smile,
  Calm: Meh,
  Sad: Frown,
  Anxious: Annoyed,
  Excited: Smile,
};

export default function DashboardClient() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);

  const prioritizedTasks = tasks.filter(task => !task.completed).slice(0, 3);
  const recentJournals = journalEntries.slice(0, 2);
  
  const moodData = journalEntries.reduce((acc, entry) => {
    const existing = acc.find(item => item.mood === entry.mood);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ mood: entry.mood, count: 1 });
    }
    return acc;
  }, [] as { mood: Mood; count: number }[]);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome Back!</h1>
        <p className="text-muted-foreground">Here's your wellness snapshot for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Prioritized Tasks</CardTitle>
              <CardDescription>Your most important upcoming tasks.</CardDescription>
            </div>
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prioritizedTasks.length > 0 ? (
                prioritizedTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                    <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => toggleTaskCompletion(task.id)} />
                    <div className="flex-1">
                      <label htmlFor={`task-${task.id}`} className="font-medium">{task.title}</label>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      <Calendar className="w-3 h-3 mr-1" />
                      {task.dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No pending tasks. Great job!</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/tasks">View All Tasks <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mood Tracker</CardTitle>
              <CardDescription>Recent mood trends.</CardDescription>
            </div>
            <BarChart className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-[150px] w-full">
              <RechartsBarChart data={moodData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="mood" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis hide={true} />
                <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={8} fill="var(--color-primary)" />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
           <CardFooter>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/journal">Go to Journal <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Journal Entries</CardTitle>
              <CardDescription>A look at your recent reflections.</CardDescription>
            </div>
            <Book className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {recentJournals.map(entry => {
              const Icon = moodIcons[entry.mood];
              return (
                <div key={entry.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-accent" />
                      <span className="font-semibold">{entry.mood}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.date.toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{entry.content}</p>
                </div>
              )
            })}
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link href="/journal">View All Entries <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
