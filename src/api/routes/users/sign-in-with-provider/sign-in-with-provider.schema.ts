import z from 'zod';

export const signInWithProviderRequestSchema = z.object({
  provider: z.literal('google'),
});
