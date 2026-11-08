import type z from 'zod';

import type { QueryResponseDef } from '#/api/db/db-tables-schema.types';

import type { getNavMenuCollectionsDbQuery } from './get-nav-menu-collections.db-query';
import type { getNavMenuCollectionsSchema } from './get-nav-menu-collections.schema';

export type GetNavMenuCollectionsRequestArgsDef = z.output<
  typeof getNavMenuCollectionsSchema
>;

export type GetNavMenuCollectionsResponseDef = QueryResponseDef<
  typeof getNavMenuCollectionsDbQuery
>;
