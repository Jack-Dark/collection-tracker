import type z from '../../node_modules/zod/v4/classic/external.d.cts';
import type { authSchema, userRolesSchema } from './auth-middleware.schema';

export type UserRoleDef = z.output<typeof userRolesSchema>;

type AuthSchemaDef = z.output<typeof authSchema>;

export type AuthContextDef = Record<
  'user',
  AuthSchemaDef & {
    impersonatedBy?: string | null | undefined;
  }
>;

export type DbQueryArgsDef<TData extends any, TContext = AuthContextDef> = [
  TData,
] extends [never]
  ? {
      context: TContext;
      data?: never;
    }
  : {
      context: TContext;
      data: TData;
    };
