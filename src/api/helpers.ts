import type { SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { ZodType } from 'zod';

import { getColumns, sql } from 'drizzle-orm';

export const buildConflictUpdateSetColumns = <
  TTable extends PgTable,
  TColumns extends keyof TTable['_']['columns'],
>(
  table: TTable,
  columnsToUpdate: Record<TColumns, true>,
) => {
  const allColumns = getColumns(table);

  const columnKeys = Object.keys(columnsToUpdate) as TColumns[];

  return columnKeys.reduce<Partial<Record<TColumns, SQL>>>((acc, columnKey) => {
    const colName = allColumns[columnKey].name;
    acc[columnKey] = sql.raw(`excluded.${colName}`);

    return acc;
  }, {});
};

/** Returns all items in `arrayA` which are not in `arrayB`. */
export const getDifferenceBetweenArrays = <
  TData extends any,
  TSchema extends ZodType<TData>,
>(
  arrayA: TData[],
  arrayB: TData[],
  schema: TSchema,
) => {
  const arrayBAsStrings = arrayB.map((item) => {
    const { data } = schema.safeParse(item);

    return JSON.stringify(data);
  });
  const stringSetB = new Set(arrayBAsStrings);

  return arrayA.filter((item) => {
    const { data } = schema.safeParse(item);
    const arrayAValue = JSON.stringify(data);

    return !stringSetB.has(arrayAValue);
  });
};
