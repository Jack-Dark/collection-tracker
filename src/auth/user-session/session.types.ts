import type { authClient } from '../auth-client';
import type { auth } from '../auth-server';
import type { getUserSession } from './get-user-session';

export type ServerUserSession = typeof auth.$Infer.Session;

export type ClientUserSession = typeof authClient.$Infer.Session;

export type UserSession = Awaited<ReturnType<typeof getUserSession>>;
