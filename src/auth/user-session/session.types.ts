import type { authClient } from '../auth-client';
import type { auth } from '../auth-server';

export type ServerSession = typeof auth.$Infer.Session;

export type ClientSession = typeof authClient.$Infer.Session;
