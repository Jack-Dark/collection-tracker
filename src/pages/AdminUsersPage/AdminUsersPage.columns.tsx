import { createColumnHelper } from '@tanstack/react-table';

import type { GetUsersResponseDef } from '#/api/routes/users/get-users/get-users.types';
import type { TableFeaturesDef } from '#/components/Table';

import { useImpersonateUser } from '#/api/routes/users/impersonate-user/impersonate-user.react-query';
import { getIsAdmin } from '#/auth/auth-middleware.helpers';
import { MoreMenu } from '#/components/MoreMenu';
import { EmptyCellValue } from '#/components/Table/components/EmptyCellValue';
import { useFormattedDate } from '#/hooks/use-formatted-date';

const columnHelper = createColumnHelper<
  TableFeaturesDef,
  GetUsersResponseDef['users'][number]
>();

export const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    cell: ({ getValue }) => {
      return getValue();
    },
    header: 'Name',
  }),
  columnHelper.accessor('email', {
    cell: ({ getValue }) => {
      return getValue();
    },
    header: 'Email',
    size: 300,
  }),
  columnHelper.accessor('createdAt', {
    cell: ({ getValue }) => {
      const formattedDate = useFormattedDate(getValue());

      return formattedDate;
    },
    header: 'Created',
  }),
  columnHelper.accessor('lastSession', {
    cell: ({ getValue }) => {
      const date = getValue();

      const formattedDate = useFormattedDate(date);

      return date ? formattedDate : <EmptyCellValue />;
    },
    header: 'Last Active',
  }),
  columnHelper.accessor('id', {
    cell: ({ getValue, row }) => {
      const userId = getValue();

      const { onImpersonateUser } = useImpersonateUser({
        showLoading: true,
      });

      return (
        <div className="flex justify-end">
          <MoreMenu
            items={[
              {
                disabled: getIsAdmin(row.original.role),
                Label: 'Impersonate',
                onClick: async () => {
                  await onImpersonateUser({ userId });
                },
              },
            ]}
          />
        </div>
      );
    },
    header: '',
    maxSize: 40,
  }),
]);
