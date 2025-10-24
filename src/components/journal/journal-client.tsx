'use client';

import { useState } from 'react';
import { useJournalStore } from '@/lib/store';
import type { JournalEntry, Mood } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Frown, Loader2, Meh, Smile, Wand2, Star, Angry } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getJournalInsights } from '@/ai/flows/journal-insights';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';
import { Separator } from '../ui/separator';

const moodOptions: { value: Mood; icon: React.ElementType; color: string }[] = [
  { value: 'Sad', icon: Frown, color: 'text-gray-500' },
  { value: 'Anxious', icon: Angry, color: 'text-purple-500' },
  { value: 'Calm', icon: Meh, color: 'text-blue-500' },
  { value: 'Happy', icon: Smile, color: 'text-green-500' },
  { value: 'Excited', icon: Star, color: 'text-yellow-500' },
];

export default function JournalClient() {
  const { entries: journalEntries, addEntry } = useJournalStore();
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('Happy');
  const [insights, setInsights] = useState('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isInsightsSheetOpen, setInsightsSheetOpen] = useState(false);
  const [isAddEntryDialogOpen, setAddEntryDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddEntry = () => {
    if (newEntryContent.trim()) {
      addEntry({
        date: new Date(),
        mood: selectedMood,
        content: newEntryContent,
      });
      setNewEntryContent('');
      setSelectedMood('Happy');
      toast({ title: 'Journal entry saved!' });
      setAddEntryDialogOpen(false);
    }
  };

  const handleGetInsights = async () => {
    if (!newEntryContent.trim()) {
      toast({
        title: 'Text is empty',
        description: 'Please write something in your journal entry to get insights.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoadingInsights(true);
    setInsightsSheetOpen(true);
    try {
      // Use the current text entry for insights
      const currentEntryText = `[${new Date().toISOString().split('T')[0]} - ${selectedMood}]: ${newEntryContent}`;
      const result = await getJournalInsights({ journalEntries: currentEntryText });
      setInsights(result.insights);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not fetch AI insights.', variant: 'destructive' });
      setInsightsSheetOpen(false);
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Emotional Journal</h1>
          <p className="text-muted-foreground">Reflect on your day, track your mood.</p>
        </div>
        <div className="flex gap-2">
            <Dialog open={isAddEntryDialogOpen} onOpenChange={setAddEntryDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Add New Journal Entry</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>How are you feeling?</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <RadioGroup value={selectedMood} onValueChange={(value: Mood) => setSelectedMood(value)} className="flex items-center justify-center gap-4">
                        {moodOptions.map(({ value, icon: Icon, color }) => (
                            <Label key={value} htmlFor={`mood-${value}`} className="cursor-pointer">
                                <RadioGroupItem value={value} id={`mood-${value}`} className="sr-only" />
                                <div className={`p-3 rounded-full transition-all ${selectedMood === value ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary hover:bg-secondary/80'}`}>
                                    <Icon className={`w-8 h-8 transition-colors ${selectedMood === value ? 'text-primary' : color}`}/>
                                </div>
                            </Label>
                        ))}
                        </RadioGroup>
                        <Textarea
                            value={newEntryContent}
                            onChange={e => setNewEntryContent(e.target.value)}
                            placeholder="Write about your day, your thoughts, or anything on your mind..."
                            rows={5}
                        />
                    </div>
                    <DialogFooter className="sm:justify-between items-center gap-2">
                         <Button onClick={handleGetInsights} disabled={isLoadingInsights} variant="default">
                            {isLoadingInsights ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                            Get AI Insight
                        </Button>
                        <Button onClick={handleAddEntry} className="bg-accent hover:bg-accent/90">Save Entry</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Past Entries</CardTitle>
            <CardDescription>Your journey of reflections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            {journalEntries.map(entry => {
                const moodOption = moodOptions.find(m => m.value === entry.mood) || moodOptions.find(m => m.value === 'Calm')!;
                const Icon = moodOption.icon;
                return(
                <Dialog key={entry.id}>
                    <DialogTrigger asChild>
                    <div className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 font-semibold">
                                <Icon className={`w-5 h-5 ${moodOption.color}`}/>
                                {entry.mood}
                            </div>
                            <p className="text-sm text-muted-foreground">{entry.date.toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{entry.content}</p>
                    </div>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                        <Icon className={`w-6 h-6 ${moodOption.color}`} />
                        {entry.mood} - {entry.date.toLocaleDateString()}
                        </DialogTitle>
                        <DialogDescription>
                        Your reflection from this day.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <p className="text-sm text-foreground leading-relaxed py-4">{entry.content}</p>
                    </DialogContent>
                </Dialog>
                );
            })}
          </div>
        </CardContent>
      </Card>
      
       <Sheet open={isInsightsSheetOpen} onOpenChange={setInsightsSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>AI Journal Insights</SheetTitle>
              <SheetDescription>Here are some patterns and insights from your current entry.</SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="prose prose-sm dark:prose-invert">
                {isLoadingInsights ? (
                    <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                    </div>
                ) : (
                    <p>{insights}</p>
                )}
            </div>
          </SheetContent>
        </Sheet>
    </div>
  );
}
