import type { authClient } from '../auth-client';
import type { auth } from '../auth-server';
import type { getUserSession } from './get-user-session';

export type ServerSession = typeof auth.$Infer.Session;

export type ClientSession = typeof authClient.$Infer.Session;

export type UserSession = Awaited<ReturnType<typeof getUserSession>>;
