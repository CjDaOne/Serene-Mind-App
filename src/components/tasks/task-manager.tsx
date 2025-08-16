'use client';

import { useState } from 'react';
import { MOCK_TASKS } from '@/lib/data';
import type { Task, Priority } from '@/lib/types';
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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSuggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTaskForSuggestion, setActiveTaskForSuggestion] = useState<Task | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(new Date());

  const { toast } = useToast();

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        dueDate: newTaskDueDate || new Date(),
        priority: newTaskPriority,
        subtasks: [],
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setNewTaskTitle('');
      setNewTaskPriority('Medium');
      setNewTaskDueDate(new Date());
      toast({ title: "Task added!", description: `Successfully added "${newTaskTitle}"` });
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
    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? { ...t, subtasks: [...t.subtasks, ...newSubtasks] } : t));
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
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <Input 
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-grow"
                />
                <Select value={newTaskPriority} onValueChange={(v: Priority) => setNewTaskPriority(v)}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full sm:w-auto justify-start text-left font-normal",
                        !newTaskDueDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={newTaskDueDate}
                        onSelect={setNewTaskDueDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <Button onClick={handleAddTask} className="w-full sm:w-auto">Add Task</Button>
            </div>
            
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
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
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
