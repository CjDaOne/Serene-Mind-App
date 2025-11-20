'use server';

/**
 * @fileOverview An AI agent that provides insights based on journal entries.
 *
 * - getJournalInsights - A function that handles the journal insights process.
 * - JournalInsightsInput - The input type for the getJournalInsights function.
 * - JournalInsightsOutput - The return type for the getJournalInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const JournalInsightsInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('A list of journal entries, separated by newlines.'),
});
export type JournalInsightsInput = z.infer<typeof JournalInsightsInputSchema>;

const JournalInsightsOutputSchema = z.object({
  insights: z.string().describe('Insights based on the journal entries.'),
});
export type JournalInsightsOutput = z.infer<typeof JournalInsightsOutputSchema>;

/**
 * Generates AI-powered insights from journal entries
 * @param input - Object containing journal entries
 * @returns Insights about mood, behavior, and patterns
 */
export async function getJournalInsights(input: JournalInsightsInput): Promise<JournalInsightsOutput> {
  return journalInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalInsightsPrompt',
  input: { schema: JournalInsightsInputSchema },
  output: { schema: JournalInsightsOutputSchema },
  prompt: `You are an AI assistant that provides insights based on journal entries.

  Analyze the following journal entries and provide insights into the user's mood, behavior, and any trends or patterns.

  Journal Entries:
  {{journalEntries}}
  `,
});

const journalInsightsFlow = ai.defineFlow(
  {
    name: 'journalInsightsFlow',
    inputSchema: JournalInsightsInputSchema,
    outputSchema: JournalInsightsOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      // Validate output against schema before returning
      const validated = JournalInsightsOutputSchema.parse(output);
      return validated;
    } catch (error) {
      // Log error without sensitive details (don't expose full error object)
      const errorType = error instanceof Error ? 'Error' : 'Unknown';
      console.error(`[journal-insights] Failed to generate insights (${errorType})`);
      
      return {
        insights: "I'm having trouble analyzing your journal right now. Please try again later.",
      };
    }
  }
);
