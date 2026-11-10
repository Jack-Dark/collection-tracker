import { createFileRoute } from '@tanstack/react-router';

import { AccountPage } from '#/pages/AccountPage';

import { createMetaTags } from '../../create-meta-tags';

export const Route = createFileRoute('/_protected/account')({
  component: AccountPage,
  head: () => {
    return {
      meta: createMetaTags({
        title: 'Account: Collection Tracker',
        description: 'Your Collection Tracker account details.',
      }),
    };
  },
});
