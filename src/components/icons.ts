import { Award, BookOpen, CalendarCheck2, Star } from 'lucide-react';
import type { IconName } from '@/lib/domain/achievement';

export const ACHIEVEMENT_ICONS = {
  Star,
  BookOpen,
  Award,
  CalendarCheck2,
} as const;

export function getAchievementIcon(name: IconName) {
  return ACHIEVEMENT_ICONS[name];
}
