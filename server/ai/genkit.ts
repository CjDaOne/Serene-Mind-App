import 'server-only';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

export async function suggestJournalTags(input: string) {
  try {
    // AI call implementation will go here
    // For now, return a placeholder
    return { ok: true as const, data: [] };
  } catch (e) {
    return { ok: false as const, error: 'AI temporarily unavailable' };
  }
}
