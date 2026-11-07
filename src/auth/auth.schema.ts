import z from 'zod';

import { userRoles } from './auth.constants';

export const userRolesSchema = z.union(
  Object.values(userRoles).map((role) => {
    return z.literal(role);
  }),
);

export const authSchema = z.object({
  id: z.string().min(1),
  impersonatedBy: z.string().nullable().optional(),
  name: z.string(),
  role: userRolesSchema.optional(),
});

export const authAdminSchema = authSchema.extend({
  role: z.literal(userRoles.admin),
});
