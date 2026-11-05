import type { auth } from '../auth';
import type { authClient } from '../auth-client';

export type ServerSession = typeof auth.$Infer.Session;

export type ClientSession = typeof authClient.$Infer.Session;
