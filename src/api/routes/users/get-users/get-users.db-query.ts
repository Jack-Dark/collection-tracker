import type { DbQueryArgsDef } from '#/auth/auth-middleware.types';

import { db } from '#/api/db';

import type { GetUsersRequestArgsDef } from './get-users.types';

export const getUsersDbQuery = async ({
  data,
}: DbQueryArgsDef<GetUsersRequestArgsDef>) => {
  const { limit, page, search, sort } = data;

  const searchQuery = search.trim();
  const users = await db.query.users.findMany({
    where: {
      email: {
        ilike: `%${searchQuery}%`,
      },
    },
    limit,
    offset: limit * (page - 1),
    orderBy: {
      [sort.field]: sort.direction,
    },
    with: {
      sessions: {
        columns: {
          updatedAt: true,
        },
      },
    },
  });

  const formattedUsers = users.map(({ sessions, ...user }) => {
    return { ...user, lastSession: sessions[0]?.updatedAt };
  });

  return { users: formattedUsers };
};
