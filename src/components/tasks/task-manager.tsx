'use client';

import { useState } from 'react';
import { MOCK_TASKS } from '@/lib/data';
import type { Task, Subtask } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, Wand2, Loader2, Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestSubtasks } from '@/ai/flows/suggest-subtasks';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSuggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTaskForSuggestion, setActiveTaskForSuggestion] = useState<Task | null>(null);

  const { toast } = useToast();

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDate = formData.get('dueDate') as string;

    if (title) {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        subtasks: [],
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setSheetOpen(false);
      toast({ title: "Task added!", description: `Successfully added "${title}"` });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({ title: "Task removed.", variant: 'destructive' });
  };
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleSubtaskCompletion = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
              ),
            }
          : task
      )
    );
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
    const newSubtasks: Subtask[] = suggested.map(s => ({
      id: `${task.id}-${Date.now()}-${Math.random()}`,
      title: s,
      completed: false,
    }));
    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? { ...t, subtasks: [...t.subtasks, ...newSubtasks] } : t));
    setSuggestionDialogOpen(false);
    setSuggestions([]);
    setActiveTaskForSuggestion(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold font-headline">Task Planner</h1>
            <p className="text-muted-foreground">Organize your goals and stay on track.</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add a new task</SheetTitle>
              <SheetDescription>What do you want to accomplish?</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleAddTask} className="mt-4 space-y-4">
              <Input name="title" placeholder="Task Title" required />
              <Textarea name="description" placeholder="Description (optional)" />
              <Input name="dueDate" type="date" />
              <Button type="submit" className="w-full">Add Task</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Accordion type="multiple" className="space-y-4">
            {tasks.map(task => (
              <AccordionItem key={task.id} value={task.id} className="border rounded-lg bg-card p-0">
                <div className="p-4 flex items-center gap-4">
                  <Checkbox 
                    id={`task-check-${task.id}`}
                    checked={task.completed} 
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />
                  <AccordionTrigger className="flex-1 p-0 text-left hover:no-underline">
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3"/> {task.dueDate.toLocaleDateString()}</p>
                    </div>
                  </AccordionTrigger>
                   <Button variant="ghost" size="icon" onClick={() => handleSuggestSubtasks(task)} disabled={isSuggestionLoading && activeTaskForSuggestion?.id === task.id}>
                    {isSuggestionLoading && activeTaskForSuggestion?.id === task.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <AccordionContent className="px-4 pb-4">
                    <div className="pl-8 space-y-2 border-l ml-2">
                        {task.subtasks.map(subtask => (
                            <div key={subtask.id} className="flex items-center gap-2 pl-4">
                                <Checkbox id={`subtask-${subtask.id}`} checked={subtask.completed} onCheckedChange={() => toggleSubtaskCompletion(task.id, subtask.id)} />
                                <label htmlFor={`subtask-${subtask.id}`} className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>{subtask.title}</label>
                            </div>
                        ))}
                        {task.subtasks.length === 0 && <p className="text-sm text-muted-foreground pl-4">No subtasks yet.</p>}
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
