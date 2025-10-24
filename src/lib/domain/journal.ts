import { z } from 'zod';

export const Mood = z.enum(['Happy', 'Calm', 'Sad', 'Excited', 'Anxious']);

export const JournalEntrySchema = z.object({
  id: z.string(),
  date: z.date(),
  mood: Mood,
  content: z.string().min(1),
});

export const JournalEntryDTO = JournalEntrySchema.extend({
  date: z.string().datetime(),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type JournalEntryDTO = z.infer<typeof JournalEntryDTO>;
export type Mood = z.infer<typeof Mood>;

export function toJournalEntryDTO(entry: JournalEntry): JournalEntryDTO {
  return {
    ...entry,
    date: entry.date.toISOString(),
  };
}

export function fromJournalEntryDTO(dto: JournalEntryDTO): JournalEntry {
  return {
    ...dto,
    date: new Date(dto.date),
  };
}
