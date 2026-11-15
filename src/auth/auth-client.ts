import { createAuthClient } from 'better-auth/client';
import { lastLoginMethodClient, adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [adminClient(), lastLoginMethodClient()],
});
