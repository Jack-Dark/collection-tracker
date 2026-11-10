import { createFileRoute } from '@tanstack/react-router';

import { createMetaTags } from '../__root';
import { AboutPage } from '../../pages/AboutPage';

export const Route = createFileRoute('/_unprotected/about')({
  component: AboutPage,
  beforeLoad: ({ context }) => {
    return { user: context.user };
  },
  head: () => {
    return {
      meta: createMetaTags({
        title: 'About Collection Tracker',
        description: 'About the Collection Tracker project.',
      }),
    };
  },
});
