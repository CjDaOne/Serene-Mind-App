'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task, Priority, Subtask } from '@/lib/types';
import { fromTaskDTO } from '@/lib/domain/task';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, Wand2, Loader2, Calendar as CalendarIcon } from 'lucide-react';
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

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.date().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTaskForSuggestion, setActiveTaskForSuggestion] = useState<Task | null>(null);

  const form = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      priority: 'Medium',
      dueDate: new Date(),
    },
  });

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

  const onSubmit = async (data: TaskForm) => {
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
        }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      await fetchTasks();
      form.reset();
      toast({ title: 'Task added!', description: `Successfully added "${data.title}"` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add task', variant: 'destructive' });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast({ title: "Task removed.", variant: 'destructive' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' });
    }
  };
  
  const toggleTaskCompletion = async (taskId: string) => {
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

  const updateSubtask = (taskId: string, subtaskId: string, completed: boolean) => {
    setTasks(tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed } : st
            ),
          }
        : t
    ));
  };

  const addSubtasks = (taskId: string, subtasks: Subtask[]) => {
    setTasks(tasks.map((t) =>
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
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch AI suggestions.", variant: "destructive" });
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
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2 mb-6">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                    <FormItem className="flex-grow">
                        <FormControl>
                        <Input placeholder="Add a new task..." {...field} />
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
                    <FormMessage />
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
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full sm:w-auto">Add Task</Button>
                </form>
            </Form>
            
            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No tasks yet. Add one to get started!</p>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-2 rounded-lg border">
                             <Checkbox 
                                id={`task-check-${task.id}`}
                                checked={task.completed} 
                                onCheckedChange={() => toggleTaskCompletion(task.id)}
                            />
                            <div className="flex-1">
                            <label htmlFor={`task-check-${task.id}`} className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</label>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3"/> {task.dueDate.toLocaleDateString()}
                            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                            <span>{task.priority} Priority</span>
                            </p>
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
                                                                onCheckedChange={(checked) => updateSubtask(task.id, subtask.id, !!checked)}
                                                            />
                                                            <label htmlFor={`subtask-${subtask.id}`} className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
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
                                        Get AI Subtasks
                                    </Button>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} aria-label="Delete task">
                            <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            <div className="text-center mt-8">
                <Button asChild size="lg" className="w-full max-w-sm">
                    <Link href="/journal">Reflect on Your Day</Link>
                </Button>
                <p className="text-muted-foreground text-sm mt-2">A gentle space to note your thoughts, not a judgment.</p>
            </div>
        </CardContent>
      </Card>
      
      {activeTaskForSuggestion && (
         <Dialog open={suggestionDialogOpen} onOpenChange={setSuggestionDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Subtask Suggestions for "{activeTaskForSuggestion.title}"</DialogTitle>
                    <DialogDescription>Here are some AI-powered suggestions to break down your task. Add them to get started.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    {suggestions.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-secondary rounded-md">
                            <Wand2 className="w-4 h-4 text-primary shrink-0"/>
                            <p className="text-sm">{s}</p>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSuggestionDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => addSuggestedSubtasks(activeTaskForSuggestion, suggestions)}>Add Subtasks</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
