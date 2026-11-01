import { paginationPropsDefaultValues } from '#/api/pagination/pagination.constants';
import { useGetUsers } from '#/api/routes/users/get-users/get-users.react-query';
import { PageWrapper } from '#/components/PageWrapper';
import { Table } from '#/components/Table';

import { columns } from './AdminUsersPage.columns';

export const AdminUsersPage = () => {
  const { data } = useGetUsers({
    placeholderData: { users: [] },
    requestArgs: {
      ...paginationPropsDefaultValues,
      sort: {
        ...paginationPropsDefaultValues.sort,
        field: 'email',
      },
    },
  });

  return (
    <PageWrapper>
      <Table columns={columns} data={data.users} />
    </PageWrapper>
  );
};
