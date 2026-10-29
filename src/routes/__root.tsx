/// <reference types="vite/client" />

import type { QueryClient } from '@tanstack/react-query';
import type { ErrorComponentProps } from '@tanstack/react-router';
import type { MetaHTMLAttributes, ReactNode } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { HotkeysProvider } from '@tanstack/react-hotkeys';
import { HotkeysDevtoolsPanel } from '@tanstack/react-hotkeys-devtools';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { StrictMode } from 'react';

import { getSession } from '#/auth/auth-middleware';
import { Button } from '#/components/Button';
import { DialogProvider } from '#/components/Dialog/Dialog.Provider';
import { PageWrapper } from '#/components/PageWrapper';
import { RouteCatchBoundary } from '#/components/RouteCatchBoundary';
import { ThemeProvider } from '#/components/ThemeProvider';
import { appHotkeys } from '#/constants/app-hotkeys';
import { githubUrl } from '#/constants/githubUrl';
import { getThemeServerFn } from '#/lib/theme';

import appCss from '../styles.css?url';

export const RouteNotFoundComponent = () => {
  return (
    <RootDocument>
      <PageWrapper>
        <div className="grid gap-10">
          <h1>Page Not Found</h1>
          <p>
            Ack! You caught us with our pants down! If you think this is bug,
            you can help us out by reporting it.
          </p>
          <a href={githubUrl.issues} target="_blank">
            <Button text="Report Bug" />
          </a>
        </div>
      </PageWrapper>
    </RootDocument>
  );
};

export const RouteErrorComponent = (props: ErrorComponentProps) => {
  return (
    <RootDocument>
      <RouteCatchBoundary {...props} />
    </RootDocument>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    const response = await getSession();

    return {
      user: {
        email: response?.user.email || '',
        emailVerified: response?.user.emailVerified || false,
        id: response?.user.id || '',
        name: response?.user.name || '',
        role: response?.user.role,
        impersonatedBy: response?.session.impersonatedBy,
      },
    };
  },
  component: RootComponent,
  errorComponent: RouteErrorComponent,
  loader: async () => {
    const theme = await getThemeServerFn();

    return { theme };
  },
  head: () => {
    return {
      links: [
        {
          href: appCss,
          rel: 'stylesheet',
        },
        {
          rel: 'icon',
          href: 'https://res.cloudinary.com/collection-tracker/image/upload/v1792538004/arfzr3nj0yt5vdfrlumt.ico',
        },
      ],
      meta: createMetaTags(
        {
          title: 'Collection Tracker',
        },
        [
          {
            charSet: 'utf-8',
          },
          {
            content: 'width=device-width, initial-scale=1',
            name: 'viewport',
          },
        ],
      ),
    };
  },
  notFoundComponent: RouteNotFoundComponent,
});

function RootComponent() {
  const queryClient = useQueryClient();

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RootDocument>
          <Outlet />
        </RootDocument>
        {import.meta.env.DEV && (
          <TanStackDevtools
            plugins={[
              formDevtoolsPlugin(),
              {
                name: 'TanStack Hotkeys',
                render: <HotkeysDevtoolsPanel />,
              },
              {
                name: 'TanStack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
      </QueryClientProvider>
    </StrictMode>
  );
}

export const RootDocument = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const { theme } = Route.useLoaderData();

  const emotionCache = createCache({ key: 'css' });

  return (
    <html data-theme={theme} lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <HotkeysProvider appHotkeys={appHotkeys}>
            <DialogProvider>
              <body className="bg-linear-to-br from-primary-900 to-secondary-900 dark:from-primary-950 dark:to-secondary-950 root grid min-h-dvh grid-rows-[max-content_1fr_max-content] text-theme-t1">
                {children}
                <Scripts />
              </body>
            </DialogProvider>
          </HotkeysProvider>
        </ThemeProvider>
      </CacheProvider>
    </html>
  );
};

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
    title,
    description = 'Your helpful tracker for all your collections!',
  } = props;

  return [
    {
      title,
    },
    {
      name: 'description',
      content: description,
    },
    ...additionalTags,
  ] satisfies MetaHTMLAttributes<HTMLMetaElement>[];
};
