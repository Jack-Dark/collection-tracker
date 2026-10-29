import z from 'zod';

import { passwordSchema } from '../sign-up/sign-up.schema';

export const signInWithEmailRequestSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});
