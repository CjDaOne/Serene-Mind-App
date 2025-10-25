import { z } from 'zod';

const EnvSchema = z.object({
  MONGODB_URI: z.string().url().optional(),
  GOOGLE_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const env = EnvSchema.parse(process.env);
