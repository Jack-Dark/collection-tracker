import type z from 'zod';

import type { signInWithEmailRequestSchema } from './sign-in-with-email.schema';
import type { signInWithEmailServerFn } from './sign-in-with-email.serverFn';

export type SignInWithEmailRequestArgsDef = z.output<
  typeof signInWithEmailRequestSchema
>;

export type SignInWithEmailResponseDef = Awaited<
  ReturnType<typeof signInWithEmailServerFn>
>;
