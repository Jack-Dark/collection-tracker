import { createFileRoute } from '@tanstack/react-router';

import { createMetaTags } from '../../create-meta-tags';
import { AboutPage } from '../../pages/AboutPage';

export const Route = createFileRoute('/_unprotected/about')({
  component: AboutPage,
  head: () => {
    return {
      meta: createMetaTags({
        title: 'About Collection Tracker',
        description: 'About the Collection Tracker project.',
      }),
    };
  },
});
