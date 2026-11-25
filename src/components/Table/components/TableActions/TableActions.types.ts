import type { RowData, SortDirection } from '@tanstack/react-table';

import type { FiltersButtonPropsDef } from '../FilterButton/FilterButton.types';
import type { SearchPropsDef } from '../Search/Search.types';

export type TableActionsPropsDef<TData extends RowData> = {
  filters?: FiltersButtonPropsDef;
  search?: SearchPropsDef;
  sort?: {
    items: SortItemDef<keyof TData>[];
    onChange: (sort: SortItemDef<keyof TData> | null) => void | Promise<void>;
    value: SortItemDef<keyof TData> | undefined;
  };
};

export type SortItemDef<TField = string, TData = Record<any, any>> =
  | {
      data?: TData;
      direction: SortDirection;
      field: TField;
      id: string;
      label: string;
      separator?: never;
    }
  | {
      data?: TData;
      direction?: never;
      field?: never;
      id?: never;
      label?: never;
      separator: true;
    };
