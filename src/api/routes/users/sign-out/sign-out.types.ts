import type { signOutServerFn } from './sign-out.serverFn';

// TODO - REFACTOR: UPDATE QUERIES TO ALLOW `NEVER` FOR ARGS
export type SignOutRequestArgsDef = {};

export type SignOutResponseDef = Awaited<ReturnType<typeof signOutServerFn>>;
