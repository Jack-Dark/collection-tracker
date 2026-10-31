import z from 'zod';

export const sendAccountDeletedEmailSchema = z.object({
  email: z.email(),
  name: z.string(),
});
