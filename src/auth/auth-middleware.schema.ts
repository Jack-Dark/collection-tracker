import z from 'zod';

export const userRoles = {
  admin: 'admin',
  user: 'user',
} as const;

export const userRolesSchema = z.union(
  Object.values(userRoles).map((role) => {
    return z.literal(role);
  }),
);

export const authSchema = z.object({
  id: z.string().min(1),
  image: z.string().nullable().optional(),
  name: z.string(),
  role: userRolesSchema.optional(),
});

export const authAdminSchema = authSchema.extend({
  role: z.literal(userRoles.admin),
});
