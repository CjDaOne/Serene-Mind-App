import { z } from 'zod';

export const IconName = z.enum(['Star', 'BookOpen', 'Award', 'CalendarCheck2']);

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  unlocked: z.boolean(),
  icon: IconName,
});

export type Achievement = z.infer<typeof AchievementSchema>;
export type IconName = z.infer<typeof IconName>;
