'use server';

/**
 * @fileOverview AI subtask suggestion agent.
 *
 * - suggestSubtasks - A function that suggests subtasks for a given task.
 * - SuggestSubtasksInput - The input type for the suggestSubtasks function.
 * - SuggestSubtasksOutput - The return type for the suggestSubtasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSubtasksInputSchema = z.object({
  task: z.string().describe('The task to generate subtasks for.'),
});

export type SuggestSubtasksInput = z.infer<typeof SuggestSubtasksInputSchema>;

const SuggestSubtasksOutputSchema = z.object({
  subtasks: z.array(z.string()).describe('The suggested subtasks for the task.'),
});

export type SuggestSubtasksOutput = z.infer<typeof SuggestSubtasksOutputSchema>;

/**
 * Generates AI-powered subtask suggestions for a given task
 * @param input - Object containing the task description
 * @returns Array of suggested subtasks
 */
export async function suggestSubtasks(input: SuggestSubtasksInput): Promise<SuggestSubtasksOutput> {
  return suggestSubtasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSubtasksPrompt',
  input: {schema: SuggestSubtasksInputSchema},
  output: {schema: SuggestSubtasksOutputSchema},
  prompt: `You are a helpful assistant that suggests subtasks for a given task.

  Task: {{{task}}}

  Please provide a list of subtasks that would help the user complete the task.
  Subtasks:`,
});

const suggestSubtasksFlow = ai.defineFlow(
  {
    name: 'suggestSubtasksFlow',
    inputSchema: SuggestSubtasksInputSchema,
    outputSchema: SuggestSubtasksOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      // Validate output against schema before returning
      const validated = SuggestSubtasksOutputSchema.parse(output);
      return validated;
    } catch (error) {
      // Log error without sensitive details
      const errorType = error instanceof Error ? 'Error' : 'Unknown';
      console.error(`[suggest-subtasks] Failed to suggest subtasks (${errorType})`);
      
      // Return sensible default subtasks as fallback
      return {
        subtasks: [
          'Review and understand the task requirements',
          'Plan your approach and resources',
          'Execute the task step by step',
          'Review and validate the results',
        ],
      };
    }
  }
);
