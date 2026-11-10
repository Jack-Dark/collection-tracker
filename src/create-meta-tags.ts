import type { MetaHTMLAttributes } from 'react';

/**
 * @example
 * export const Route = createFileRoute('/your-route-path')({
 *   component: YourRouteComponent,
 *   head: () => {
 *     return {
 *       meta: createMetaTags({
 *         title: 'Sign In',
 *         description: 'Sign in to your Collection Tracker account.',
 *       }),
 *     };
 *   },
 * });
 */

export const createMetaTags = (
  props: {
    description?: string;
    title: string;
  },
  additionalTags: MetaHTMLAttributes<HTMLMetaElement>[] = [],
) => {
  const {
    description = 'Your helpful tracker for all your collections!',
    title,
  } = props;

  return [
    {
      title,
    },
    {
      content: description,
      name: 'description',
    },
    ...additionalTags,
  ] satisfies MetaHTMLAttributes<HTMLMetaElement>[];
};
