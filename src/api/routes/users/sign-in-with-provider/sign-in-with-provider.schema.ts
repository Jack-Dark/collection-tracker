import z from 'zod';

export const signInWithProviderRequestSchema = z.object({
  provider: z.union([z.literal('google')]),
  disableRedirect: z.boolean().optional(),
  callbackURL: z.string().optional(),
});
