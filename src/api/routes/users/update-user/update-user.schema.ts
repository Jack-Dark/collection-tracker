import z from 'zod';

export const updateUserSchema = z.strictObject({
  name: z.string().min(1),
});

export const updateUserFormSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});
