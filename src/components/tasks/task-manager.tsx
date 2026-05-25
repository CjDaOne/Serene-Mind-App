'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task, Subtask } from '@/lib/types';
import { fromTaskDTO } from '@/lib/domain/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, Wand2, Loader2, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { suggestSubtasks } from '@/ai/flows/suggest-subtasks';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getDemoTasks } from '@/lib/demo-data';
import { GuestLimitModal } from '@/components/guest-limit-modal';

// 1–5 scale matching core/types.ts TaskMetrics exactly
const METRIC_OPTIONS = [
  { value: '1', label: 'Minimal' },
  { value: '2', label: 'Light' },
  { value: '3', label: 'Moderate' },
  { value: '4', label: 'High' },
  { value: '5', label: 'Intensive' },
] as const;

const metricValue = z.coerce
  .number()
  .int()
  .min(1)
  .max(5)
  .transform(n => n as 1 | 2 | 3 | 4 | 5);

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.date().optional(),
  // Recovery-oriented defaults: light across the board
  cognitiveLoad: metricValue.default(2),
  emotionalFriction: metricValue.default(2),
  energyDemand: metricValue.default(2),
});

type TaskForm = z.infer<typeof taskSchema>;

const GUEST_TASK_LIMIT = 5;

function MetricSelect({
  label,
  name,
  control,
}: {
  label: string;
  name: 'cognitiveLoad' | 'emotionalFriction' | 'energyDemand';
  control: ReturnType<typeof useForm<TaskForm>>['control'];
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1 min-w-[120px]">
          <FormLabel className="text-xs text-muted-foreground">{label}</FormLabel>
          <Select
            onValueChange={val => field.onChange(parseInt(val, 10))}
            defaultValue={String(field.value ?? 2)}
          >
            <FormControl>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {METRIC_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function LoadBadge({ value }: { value: number }) {
  const label = METRIC_OPTIONS.find(o => o.value === String(value))?.label ?? 'Moderate';
  const color =
    value <= 2 ? 'bg-green-100 text-green-800' :
    value === 3 ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${color}`}>{label}</span>
  );
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTaskForSuggestion, setActiveTaskForSuggestion] = useState<Task | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const { data: session } = useSession();

  const form = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      priority: 'Medium',
      dueDate: new Date(),
      cognitiveLoad: 2,
      emotionalFriction: 2,
      energyDemand: 2,
    },
  });

  const { toast } = useToast();

  const fetchTasks = async () => {
    if (session?.user?.isGuest) {
      setTasks(getDemoTasks());
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const taskDTOs = await response.json();
      setTasks(taskDTOs.map(fromTaskDTO));
    } catch {
      toast({ title: 'Error', description: 'Failed to load tasks', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [session]);

  const onSubmit = async (data: TaskForm) => {
    if (session?.user?.isGuest) {
      if (tasks.length >= GUEST_TASK_LIMIT) {
        setShowLimitModal(true);
        return;
      }
      const newTask: Task = {
        id: `guest-task-${Date.now()}`,
        title: data.title,
        completed: false,
        dueDate: data.dueDate || new Date(),
        priority: data.priority,
        subtasks: [],
        metrics: {
          cognitiveLoad: data.cognitiveLoad,
          emotionalFriction: data.emotionalFriction,
          energyDemand: data.energyDemand,
        },
      };
      setTasks([...tasks, newTask]);
      form.reset();
      toast({ title: 'Task added' });
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          completed: false,
          dueDate: data.dueDate || new Date(),
          priority: data.priority,
          subtasks: [],
          // Metrics persisted to DB — engine uses these for scoring
          metrics: {
            cognitiveLoad: data.cognitiveLoad,
            emotionalFriction: data.emotionalFriction,
            energyDemand: data.energyDemand,
          },
        }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      await fetchTasks();
      form.reset();
      toast({ title: 'Task added' });
    } catch {
      toast({ title: 'Error', description: 'Failed to add task', variant: 'destructive' });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (session?.user?.isGuest) {
      setTasks(tasks.filter(t => t.id !== taskId));
      return;
    }
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch {
      toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' });
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (session?.user?.isGuest) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    } catch {
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' });
    }
  };

  const updateSubtask = async (taskId: string, subtaskId: string, completed: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed } : st
    );

    setTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t));
    if (session?.user?.isGuest) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks }),
      });
      if (!response.ok) throw new Error('Failed to update subtask');
    } catch {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, subtasks: task.subtasks } : t));
      toast({ title: 'Error', description: 'Failed to save subtask update', variant: 'destructive' });
    }
  };

  const addSubtasks = (taskId: string, subtasks: Subtask[]) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, subtasks: [...t.subtasks, ...subtasks] } : t
    ));
  };

  const handleSuggestSubtasks = async (task: Task) => {
    setSuggestionLoading(true);
    setActiveTaskForSuggestion(task);
    try {
      const result = await suggestSubtasks({ task: task.title });
      setSuggestions(result.subtasks);
      setSuggestionDialogOpen(true);
    } catch {
      toast({ title: 'Error', description: 'Could not fetch suggestions.', variant: 'destructive' });
    } finally {
      setSuggestionLoading(false);
    }
  };

  const addSuggestedSubtasks = (task: Task, suggested: string[]) => {
    const newSubtasks = suggested.map(s => ({
      id: `${task.id}-${Date.now()}-${Math.random()}`,
      title: s,
      completed: false,
    }));
    addSubtasks(task.id, newSubtasks);
    setSuggestionDialogOpen(false);
    setSuggestions([]);
    setActiveTaskForSuggestion(null);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mb-6">
              {/* Primary row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="Add a task..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-[120px]">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-auto">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              {/* Capacity row — collapsible to avoid overwhelming the UI */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowMetrics(m => !m)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${showMetrics ? 'rotate-180' : ''}`} />
                  Task capacity settings
                </button>
                {showMetrics && (
                  <div className="flex gap-3 mt-2 flex-wrap">
                    <MetricSelect label="Mental effort" name="cognitiveLoad" control={form.control} />
                    <MetricSelect label="Emotional weight" name="emotionalFriction" control={form.control} />
                    <MetricSelect label="Energy needed" name="energyDemand" control={form.control} />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full sm:w-auto">Add Task</Button>
            </form>
          </Form>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tasks yet. Add one whenever you&apos;re ready.</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Checkbox
                    id={`task-check-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`task-check-${task.id}`}
                      className={`font-medium block ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {task.dueDate.toLocaleDateString()}
                      </span>
                      {/* Show cognitive load badge so users can see why tasks surface in certain modes */}
                      {task.metrics && (
                        <LoadBadge value={task.metrics.cognitiveLoad} />
                      )}
                    </div>

                    {task.subtasks.length > 0 && (
                      <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value={`subtasks-${task.id}`} className="border-none">
                          <AccordionTrigger className="text-sm py-1 hover:no-underline">
                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-1 ml-4">
                              {task.subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2">
                                  <Checkbox
                                    id={`subtask-${subtask.id}`}
                                    checked={subtask.completed}
                                    onCheckedChange={checked => updateSubtask(task.id, subtask.id, !!checked)}
                                  />
                                  <label
                                    htmlFor={`subtask-${subtask.id}`}
                                    className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}
                                  >
                                    {subtask.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {task.subtasks.length === 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-6 px-2 text-xs"
                        onClick={() => handleSuggestSubtasks(task)}
                        disabled={isSuggestionLoading}
                      >
                        {isSuggestionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                        Break into steps
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label="Delete task"
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {activeTaskForSuggestion && (
        <Dialog open={suggestionDialogOpen} onOpenChange={setSuggestionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Breaking down &quot;{activeTaskForSuggestion.title}&quot;</DialogTitle>
              <DialogDescription>Smaller steps make it easier to start.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                  <Wand2 className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm">{s}</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSuggestionDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => addSuggestedSubtasks(activeTaskForSuggestion, suggestions)}>Add steps</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <GuestLimitModal
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        limitType="tasks"
        currentCount={tasks.length}
        maxCount={GUEST_TASK_LIMIT}
      />
    </div>
  );
}
