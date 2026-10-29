import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

import { db } from '#/api/db';
import { sendResetPasswordEmailServerFn } from '#/api/routes/emails/send-reset-password-email/send-reset-password-email.serverFn';
import { sendVerificationEmailServerFn } from '#/api/routes/emails/send-verification-email/send-verification-email.serverFn';
import { createNewUserExampleRecordsDbQuery } from '#/api/routes/users/sign-up/sign-up.db-query';
import { configs } from '#/configs';

import type { UserRoleDef } from './auth-middleware.types';

import * as schema from '../api/db-tables-schema';

export const resetPasswordTokenExpiresInMinutes = 20;
const resetPasswordTokenExpiresInSeconds =
  resetPasswordTokenExpiresInMinutes * 60;

export const auth = betterAuth({
  baseURL: configs.betterAuthUrl,
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
      enabled: true,
    },
  },
});
