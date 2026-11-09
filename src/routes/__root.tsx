/// <reference types="vite/client" />

import type { QueryClient } from '@tanstack/react-query';
import type { ErrorComponentProps } from '@tanstack/react-router';
import type { MetaHTMLAttributes, ReactNode } from 'react';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { detectPlatform, HotkeysProvider } from '@tanstack/react-hotkeys';
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
import { createIsomorphicFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { StrictMode } from 'react';

import { getNavMenuCollectionsQueryOptions } from '#/api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { getUserSession } from '#/auth/user-session/get-user-session';
import { Button } from '#/components/Button';
import { DialogProvider } from '#/components/Dialog/Dialog.Provider';
import { PageWrapper } from '#/components/PageWrapper';
import { RouteCatchBoundary } from '#/components/RouteCatchBoundary';
import { ThemeProvider, useTheme } from '#/components/ThemeProvider';
import { appHotkeys } from '#/constants/app-hotkeys';
import { githubUrl } from '#/constants/githubUrl';
import { UserSessionProvider } from '#/context/user';
import { handleThemeCookie, themeAttr } from '#/lib/theme';

import appCss from '../styles.css?url';

export const RouteNotFoundComponent = () => {
  return (
    <PageWrapper>
      <div className="grid gap-10">
        <h1>Page Not Found</h1>
        <p>
          Ack! You caught us with our pants down! If you think this is bug, you
          can help us out by reporting it.
        </p>
        <a href={githubUrl.issues} target="_blank">
          <Button text="Report Bug" />
        </a>
      </div>
    </PageWrapper>
  );
};

export const RouteErrorComponent = (props: ErrorComponentProps) => {
  return <RouteCatchBoundary {...props} />;
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  loader: async ({ context }) => {
    const { themeCookie } = handleThemeCookie();

    const queryOptions = getNavMenuCollectionsQueryOptions();

    const [user] = await Promise.all([
      getUserSession(),
      context.queryClient.query(queryOptions),
    ]);

    return {
      theme: themeCookie,
      user,
    };
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
});

function RootComponent() {
  const isDevMode = import.meta.env.DEV;

  return (
    <StrictMode>
      <AllProviders>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </AllProviders>
      {isDevMode && (
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
    </StrictMode>
  );
}

const getPlatform = createIsomorphicFn()
  .server(() => {
    return detectPlatform(getRequestHeader('user-agent'));
  })
  .client(() => {
    return detectPlatform();
  });

const AllProviders = ({ children }: Readonly<{ children: ReactNode }>) => {
  const queryClient = useQueryClient();
  const emotionCache = createCache({ key: 'css' });
  const { theme, user } = Route.useLoaderData();

  return (
    <UserSessionProvider initialUserSession={user}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider initialTheme={theme}>
            <HotkeysProvider
              appHotkeys={appHotkeys}
              defaultOptions={{ platform: getPlatform() }}
            >
              <DialogProvider>{children}</DialogProvider>
            </HotkeysProvider>
          </ThemeProvider>
        </CacheProvider>
      </QueryClientProvider>
    </UserSessionProvider>
  );
};

export const RootDocument = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const { theme } = useTheme();

  return (
    <html {...{ [themeAttr]: theme }} lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />

        {/* Required to render vite checker overlay: https://vite-plugin-checker.netlify.app/recipes/backend-integration */}
        {process.env.NODE_ENV === 'development' && (
          <script
            src="http://localhost:3000/@vite-plugin-checker-runtime-entry"
            type="module"
          />
        )}
      </head>

      <body className="bg-linear-to-br from-primary-900 to-secondary-900 dark:from-primary-950 dark:to-secondary-950 root grid min-h-dvh grid-rows-[max-content_1fr_max-content] text-theme-t1">
        {children}
        <Scripts />
      </body>
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
