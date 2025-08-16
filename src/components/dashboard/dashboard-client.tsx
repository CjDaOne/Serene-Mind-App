'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_TASKS, MOCK_JOURNAL_ENTRIES } from '@/lib/data';
import type { Task, JournalEntry, Mood } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const moodVerbiage: Record<Mood, string> = {
  Happy: 'feeling happy',
  Calm: 'feeling calm',
  Sad: 'feeling sad',
  Anxious: 'feeling anxious',
  Excited: 'feeling excited',
};


export default function DashboardClient() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);

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
      <div className="text-center bg-gradient-to-r from-primary to-primary/70 text-primary-foreground p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold font-headline">Hello, Wellness Seeker!</h1>
        <p className="text-lg mt-2 text-primary-foreground/80">"Every day is a new opportunity to grow."</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Focus Tasks</CardTitle>
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
                <p className="text-muted-foreground italic">"{journalEntries[0].content}"</p>
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
      </div>
    </div>
  );
}
