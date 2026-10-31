import z from 'zod';

export const sendDeleteAccountVerificationEmailSchema = z.object({
  url: z.string(),
  email: z.email(),
  name: z.string(),
});
