import type {
  RowData,
  Table as TableDef,
  TableFeatures,
  TableOptions,
} from '@tanstack/react-table';
import type { JSXElementConstructor } from 'react';

import { ScrollArea } from '@base-ui/react';
import { useKeyHold } from '@tanstack/react-hotkeys';
import { useLocation } from '@tanstack/react-router';
import {
  columnSizingFeature,
  columnVisibilityFeature,
  coreRowModelsFeature,
  flexRender,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { useLayoutEffect, useMemo, useState } from 'react';
import { twJoin } from 'tailwind-merge';

import type { TableActionsPropsDef } from './components/TableActions/TableActions.types';
import type { TablePaginationPropsDef } from './components/TablePagination/TablePagination.types';
import type { TableSettingsMenuPropsDef } from './components/TableSettingsMenu/TableSettingsMenu.types';

import { CheckboxField } from '../Fields/CheckboxField';
import { TableActions } from './components/TableActions';
import { TablePagination } from './components/TablePagination';
import { TableSettingsMenu } from './components/TableSettingsMenu';

const tableCellClasses = twJoin(
  'text-left px-2 py-1 border-b z-0 min-h-9',
  'first:sticky first:left-0 first:z-1 first:border-r first:border-r-transparent first:group-data-overflow-x-start:border-r-theme-surface-3',
  'last:sticky last:right-0 last:z-1 last:border-l last:border-l-transparent last:group-data-overflow-x-end:border-l-theme-surface-3',
);

const tableRowClasses = 'h-8 hover:bg-primary-950 not-last:*:border-b';

export type AboveTableComponentDef<
  TTableFeatures extends TableFeatures,
  TData extends RowData,
> = JSXElementConstructor<{
  table: TableDef<TTableFeatures, TData>;
}>;

export type TablePropsDef<
  TTableFeatures extends TableFeatures,
  TData extends RowData,
> = Omit<TableOptions<TTableFeatures, TData>, 'features'> &
  Partial<Pick<TableOptions<TTableFeatures, TData>, 'features'>> &
  TableActionsPropsDef<TData> & {
    AboveTableComponent?: AboveTableComponentDef<TTableFeatures, TData>;
    disableRowSelection?: boolean;
    pagination?: TablePaginationPropsDef;
    settings?: TableSettingsMenuPropsDef;
    showRowSelection?: boolean;
  };

export const defaultTableFeatures = tableFeatures({
  columnSizingFeature,
  columnVisibilityFeature,
  coreRowModelsFeature,
  rowSelectionFeature,
}) satisfies TableFeatures;

export type TableFeaturesDef = typeof defaultTableFeatures &
  Partial<TableFeatures>;

export interface GetItemsInRangePropsDef<TValue extends any> {
  currentIndex: number;
  items: TValue[];
  prevIndex: number;
}

export const getItemsInRange = <TValue extends any>(
  props: GetItemsInRangePropsDef<TValue>,
): TValue[] => {
  const { currentIndex, items, prevIndex } = props;

  const rangeStart = Math.min(prevIndex, currentIndex);
  const rangeEnd = Math.max(prevIndex, currentIndex);

  return items.slice(rangeStart, rangeEnd + 1);
};

export const Table = <TData extends RowData>({
  AboveTableComponent,
  columns,
  data,
  disableRowSelection,
  features,
  filters,
  getRowId = (row, index) => {
    // @ts-expect-error
    return String(row?.id || index);
  },
  pagination,
  search,
  settings,
  showRowSelection,
  sort,
  ...useTableProps
}: TablePropsDef<TableFeaturesDef, TData>) => {
  const table = useTable({
    ...useTableProps,
    columns,
    data,
    enableRowSelection: showRowSelection,
    features: { ...defaultTableFeatures, ...features },
    getRowId,
  });

  const isShiftHeld = useKeyHold('Shift');

  const [lastSelectedRowId, setLastSelectedRowId] = useState<
    string | undefined
  >(undefined);

  const showTableActions = !!filters || !!search || !!sort;

  const tableWrapperClasses = useMemo(() => {
    if (showTableActions && pagination) {
      return 'grid-rows-[auto_auto_1fr_auto]';
    }
    if (showTableActions) {
      return 'grid-rows-[auto_auto_1fr]';
    }
    if (pagination) {
      return 'grid-rows-[auto_1fr_auto]';
    }

    return '';
  }, [showTableActions, !!pagination]);

  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (table.getIsSomeRowsSelected()) {
      table.resetRowSelection();
    }
  }, [pathname]);

  useLayoutEffect(() => {
    table.resetRowSelection();
  }, [data]);

  return (
    <div
      className={`grid gap-2 md:gap-4 h-full max-h-[calc(100dvh-4rem)] ${tableWrapperClasses}`}
    >
      {AboveTableComponent && <AboveTableComponent table={table} />}
      {showTableActions && (
        <TableActions filters={filters} search={search} sort={sort} />
      )}
      <div className="min-h-0 overflow-hidden">
        <ScrollArea.Root className="group h-full">
          <ScrollArea.Viewport className="h-full">
            <ScrollArea.Content className="h-full">
              <table className="table md:table-fixed size-full overflow-auto border-spacing-0 border-separate">
                <thead className="sticky top-0 z-2 group-data-overflow-y-start:shadow-[0_0_2rem_rgba(0,0,0,.25)]">
                  {table.getHeaderGroups().map((hg) => {
                    return (
                      <tr className={tableRowClasses} key={hg.id}>
                        {hg.headers.map((header, index) => {
                          const showSelectionCheckbox =
                            index === 0 && showRowSelection;

                          const headerContent = flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          );

                          const checked = table.getIsAllRowsSelected();
                          const indeterminate = table.getIsSomeRowsSelected();

                          return (
                            <th
                              className={twJoin(
                                'text-left px-2 py-1 whitespace-nowrap md:whitespace-normal',
                                tableCellClasses,
                              )}
                              colSpan={header.colSpan}
                              key={header.id}
                              style={{ width: `${header.getSize()}px` }}
                            >
                              {showSelectionCheckbox ? (
                                <div className="flex items-center gap-2">
                                  <CheckboxField
                                    aria-label={
                                      checked
                                        ? 'Unselect all rows'
                                        : 'Select all rows'
                                    }
                                    checked={checked}
                                    disabled={disableRowSelection}
                                    indeterminate={indeterminate}
                                    onCheckedChange={(_checked, { event }) => {
                                      const toggleAllRowsSelected =
                                        table.getToggleAllRowsSelectedHandler();

                                      setLastSelectedRowId(undefined);
                                      toggleAllRowsSelected(event);
                                    }}
                                  />
                                  {headerContent}
                                </div>
                              ) : (
                                headerContent
                              )}

                              {index === hg.headers.length - 1 && settings && (
                                <TableSettingsMenu {...settings} />
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    );
                  })}
                </thead>
                <tbody className="overflow-auto min-h-100">
                  {table.getRowModel().rows.map((row) => {
                    const onCheckedChange = (checked: boolean) => {
                      const { rows } = table.getRowModel();
                      const rowId = row.id;

                      if (isShiftHeld && lastSelectedRowId) {
                        const currentIndex = row.index;
                        const prevIndex = rows.findIndex(({ id }) => {
                          return id === lastSelectedRowId;
                        });

                        const rowsToToggle = getItemsInRange({
                          currentIndex,
                          items: rows,
                          prevIndex,
                        });

                        rowsToToggle.forEach((row) => {
                          row.toggleSelected(checked);
                        });
                      } else {
                        row.toggleSelected();
                      }

                      table.setRowSelection((prevSelectedRows) => {
                        const selectedRows = {
                          ...prevSelectedRows,
                        };
                        if (checked) {
                          selectedRows[rowId] = true;
                        } else {
                          delete selectedRows[rowId];
                        }

                        return selectedRows;
                      });
                      setLastSelectedRowId(rowId);

                      // ? clears any text highlighting
                      document.getSelection()?.removeAllRanges();
                    };

                    return (
                      <tr
                        className={tableRowClasses}
                        data-row-id={row.id}
                        key={row.id}
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          const { column } = cell;

                          const checked = row.getIsSelected();
                          const disabled =
                            disableRowSelection || !row.getCanSelect();

                          const showSelectionCheckbox =
                            index === 0 && showRowSelection;

                          const cellContent = flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          );

                          return (
                            <td
                              className={tableCellClasses}
                              data-column-id={column.id}
                              key={cell.id}
                              style={{ width: `${column.getSize()}px` }}
                            >
                              {showSelectionCheckbox ? (
                                <div className="relative h-full flex items-center gap-2">
                                  <CheckboxField
                                    aria-label={
                                      checked ? 'Unselect row' : 'Select row'
                                    }
                                    checked={checked}
                                    disabled={disabled}
                                    onCheckedChange={onCheckedChange}
                                  />
                                  {cellContent}
                                </div>
                              ) : (
                                cellContent
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  <tr data-spacer-row="" />
                </tbody>
              </table>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <div
            className="relative z-50 group-data-overflow-y-end:h-8 group-data-overflow-y-end:shadow-[0_0_2rem_rgba(0,0,0,.25)]"
            data-scroll-bottom-shadow=""
          />
        </ScrollArea.Root>
      </div>
      {pagination && <TablePagination pagination={pagination} />}
    </div>
  );
};
