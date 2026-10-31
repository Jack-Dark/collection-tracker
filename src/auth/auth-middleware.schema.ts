import z from 'zod';

export const userRolesSchema = z.union([z.literal('admin'), z.literal('user')]);

export const authSchema = z.object({
  id: z.string().min(1),
  image: z.string().nullable().optional(),
  name: z.string(),
  role: userRolesSchema.optional(),
});

export const authAdminSchema = authSchema.extend({
  role: z.literal('admin'),
});
