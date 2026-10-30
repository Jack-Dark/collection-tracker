import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, lastLoginMethod } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

import { db } from '#/api/db';
import { sendAccountDeletedEmailServerFn } from '#/api/routes/emails/send-account-deleted-email/send-account-deleted-email.serverFn';
import { sendDeleteAccountVerificationEmailServerFn } from '#/api/routes/emails/send-delete-account-verification-email/send-delete-account-verification-email.serverFn';
import { sendResetPasswordEmailServerFn } from '#/api/routes/emails/send-reset-password-email/send-reset-password-email.serverFn';
import { sendVerificationEmailServerFn } from '#/api/routes/emails/send-verification-email/send-verification-email.serverFn';
import { getUserImagesDbQuery } from '#/api/routes/users/delete-user/delete-user.db-query';
import { createNewUserExampleRecordsDbQuery } from '#/api/routes/users/sign-up/sign-up.db-query';
import { configs } from '#/configs';
import { deleteCloudinaryAssetsByPublicIds } from '#/lib/cloudinary';

import type { UserRoleDef } from './auth-middleware.types';

import * as schema from '../api/db-tables-schema';

export const resetPasswordTokenExpiresInMinutes = 20;
const resetPasswordTokenExpiresInSeconds =
  resetPasswordTokenExpiresInMinutes * 60;

export const auth = betterAuth({
  baseURL: configs.siteUrl,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account: schema.accountsTable,
      session: schema.sessionsTable,
      user: schema.usersTable,
      verification: schema.verificationsTable,
    },
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createNewUserExampleRecordsDbQuery({
            context: {
              user: {
                ...user,
                role: user.role as UserRoleDef,
              },
            },
            data: undefined,
          });
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: resetPasswordTokenExpiresInSeconds,
    sendResetPassword: async ({ url, user }) => {
      await sendResetPasswordEmailServerFn({
        data: {
          email: user.email,
          name: user.name,
          url,
        },
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignIn: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ url, user }) => {
      await sendVerificationEmailServerFn({
        data: {
          email: user.email,
          name: user.name,
          url,
        },
      });
    },
  },
  plugins: [
    lastLoginMethod(),
    admin(),
    // ! make sure this is the last plugin in the array
    tanstackStartCookies(),
  ],
  socialProviders: {
    google: {
      clientId: configs.googleWebClientId,
      clientSecret: configs.googleClientSecret,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    deleteUser: {
      afterDelete: async (user) => {
        await Promise.all([
          await db.transaction(async (tx) => {
            const publicIdsToDelete = await getUserImagesDbQuery({
              context: {
                user,
              },
              data: {},
              tx,
            });

            await deleteCloudinaryAssetsByPublicIds(...publicIdsToDelete);
          }),
          await sendAccountDeletedEmailServerFn({
            data: {
              email: user.email,
              name: user.name,
            },
          }),
        ]);
      },
      enabled: true,
      sendDeleteAccountVerification: async ({ url, user }) => {
        await sendDeleteAccountVerificationEmailServerFn({
          data: {
            email: user.email,
            name: user.name,
            url,
          },
        });
      },
    },
  },
});
