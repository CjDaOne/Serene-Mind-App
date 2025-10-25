import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { JournalEntry } from '@/lib/types';

// Mock API functions - replace with real API calls
const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
  // TODO: Replace with actual API call
  return [];
};

const createJournalEntry = async (entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
  // TODO: Replace with actual API call
  return { ...entry, id: Date.now().toString() };
};

export const useJournalEntries = () => {
  return useQuery({
    queryKey: ['journal'],
    queryFn: fetchJournalEntries,
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
  });
};