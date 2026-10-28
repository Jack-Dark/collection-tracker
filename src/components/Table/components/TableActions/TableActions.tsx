import type { RowData } from '@tanstack/react-table';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useMemo } from 'react';

import { SelectField } from '#/components/Fields/SelectField';

import type { TableActionsPropsDef } from './TableActions.types';

import { FilterButton } from '../FilterButton';
import { Search } from '../Search';

export const TableActions = <TData extends RowData>(
  props: TableActionsPropsDef<TData>,
) => {
  const { filters, search, sort } = props;

  const actionsColumns = useMemo(() => {
    if (filters && sort) {
      return 'grid-cols-[auto_1fr_auto]';
    }
    if (filters) {
      return 'grid-cols-[auto_1fr]';
    }
    if (sort) {
      return 'grid-cols-[1fr_auto]';
    }

    return '';
  }, [!!filters, !!search, !!sort]);

  return (
    <div className={`grid ${actionsColumns} items-stretch gap-2 md:gap-4`}>
      {filters && <FilterButton {...filters} />}
      {search && <Search {...search} />}
      {sort ? (
        <SelectField
          aria-label="Sort table"
          items={sort.items}
          onValueChange={sort.onChange}
          RenderValue={({ item }) => {
            return (
              <div className="flex items-center gap-2">
                <SwapVertIcon />
                <span className="sr-only md:not-sr-only">
                  {String(item.label)}
                </span>
              </div>
            );
          }}
          value={sort.value}
        />
      ) : (
        <div data-search-placeholder="" />
      )}
    </div>
  );
};
