'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { isSameDay } from 'date-fns';
import { Badge } from '../ui/badge';
import { fromTaskDTO } from '@/lib/domain/task';
import { useToast } from '@/hooks/use-toast';

export default function CalendarClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const taskDTOs = await response.json();
      setTasks(taskDTOs.map(fromTaskDTO));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load tasks', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' });
    }
  };

  const tasksOnSelectedDay = selectedDate ? tasks.filter(task => isSameDay(task.dueDate, selectedDate)) : [];

  const daysWithTasks = tasks.map(task => task.dueDate);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Calendar View</h1>
        <p className="text-muted-foreground">Visualize your tasks and plan your days.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiers={{
                  hasTasks: daysWithTasks,
                }}
                modifiersStyles={{
                  hasTasks: {
                    position: 'relative',
                  }
                }}
                components={{
                  DayContent: (props) => {
                    const originalContent = <div className="relative flex items-center justify-center h-full w-full">{props.date.getDate()}</div>;
                    const hasTask = daysWithTasks.some(d => isSameDay(props.date, d));

                    if (hasTask) {
                      return <div className="relative flex items-center justify-center h-full w-full">{props.date.getDate()}
                        <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
                      </div>
                    }
                    return originalContent;
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tasks for {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'today'}</CardTitle>
              <CardDescription>What&apos;s on your plate?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {tasksOnSelectedDay.length > 0 ? (
                  tasksOnSelectedDay.map(task => (
                    <div key={task.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary">
                      <Checkbox id={`cal-task-${task.id}`} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                      <div>
                        <label htmlFor={`cal-task-${task.id}`} className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</label>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      {task.completed && <Badge>Completed</Badge>}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No tasks scheduled for this day.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
