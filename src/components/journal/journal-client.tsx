'use client';

import { useState } from 'react';
import { MOCK_JOURNAL_ENTRIES } from '@/lib/data';
import type { JournalEntry, Mood } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Frown, Loader2, Meh, Smile, Wand2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getJournalInsights } from '@/ai/flows/journal-insights';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';

const moodOptions: { value: Mood; icon: React.ElementType; color: string }[] = [
  { value: 'Happy', icon: Smile, color: 'text-green-500' },
  { value: 'Excited', icon: Star, color: 'text-yellow-500' },
  { value: 'Calm', icon: Meh, color: 'text-blue-500' },
  { value: 'Sad', icon: Frown, color: 'text-gray-500' },
];

export default function JournalClient() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('Calm');
  const [insights, setInsights] = useState('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isInsightsSheetOpen, setInsightsSheetOpen] = useState(false);
  const { toast } = useToast();

  const handleAddEntry = () => {
    if (newEntryContent.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date(),
        mood: selectedMood,
        content: newEntryContent,
      };
      setJournalEntries(prev => [newEntry, ...prev]);
      setNewEntryContent('');
      toast({ title: 'Journal entry saved!' });
    }
  };

  const handleGetInsights = async () => {
    setIsLoadingInsights(true);
    setInsightsSheetOpen(true);
    try {
      const allEntriesText = journalEntries.map(e => `[${e.date.toISOString().split('T')[0]} - ${e.mood}]: ${e.content}`).join('\n\n');
      const result = await getJournalInsights({ journalEntries: allEntriesText });
      setInsights(result.insights);
    } catch (error) {
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
         <Button onClick={handleGetInsights} disabled={isLoadingInsights}>
          {isLoadingInsights ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
          Get AI Insights
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>New Entry</CardTitle>
              <CardDescription>How are you feeling today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Select your mood</Label>
                <RadioGroup value={selectedMood} onValueChange={(value: Mood) => setSelectedMood(value)} className="flex items-center justify-around gap-2">
                  {moodOptions.map(({ value, icon: Icon, color }) => (
                    <Label key={value} htmlFor={value}>
                      <RadioGroupItem value={value} id={value} className="sr-only" />
                       <div className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 cursor-pointer transition-colors w-20 h-20 justify-center ${selectedMood === value ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-secondary'}`}>
                        <Icon className={`w-8 h-8 ${selectedMood === value ? 'text-primary' : color}`}/>
                        <span className="text-xs font-medium">{value}</span>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <Textarea
                value={newEntryContent}
                onChange={e => setNewEntryContent(e.target.value)}
                placeholder="Write about your day..."
                rows={6}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddEntry} className="w-full">Save Entry</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
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
        </div>
      </div>
      
       <Sheet open={isInsightsSheetOpen} onOpenChange={setInsightsSheetOpen}>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>AI Journal Insights</SheetTitle>
              <SheetDescription>Here are some patterns and insights from your entries.</SheetDescription>
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
