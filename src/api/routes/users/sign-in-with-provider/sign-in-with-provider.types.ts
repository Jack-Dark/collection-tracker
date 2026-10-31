import type z from 'zod';

import type { signInWithProviderRequestSchema } from './sign-in-with-provider.schema';
import type { signInWithProviderServerFn } from './sign-in-with-provider.serverFn';

export type SignInWithProviderRequestArgsDef = z.output<
  typeof signInWithProviderRequestSchema
>;

export type SignInWithProviderResponseDef = Awaited<
  ReturnType<typeof signInWithProviderServerFn>
>;
