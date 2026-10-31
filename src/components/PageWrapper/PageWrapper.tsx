import type { PropsWithChildren, ReactNode } from 'react';

import CoffeeIcon from '@mui/icons-material/Coffee';
import GitHubIcon from '@mui/icons-material/GitHub';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Suspense } from 'react';
import { twJoin } from 'tailwind-merge';

import { githubUrl } from '#/constants/githubUrl';
import { useUserContext } from '#/hooks/use-user-context';

import { MobileNavMenu } from '../NavMenu/components/MobileNavMenu';
import { ListMobileMenuItems } from '../NavMenu/components/MobileNavMenu/components/ListMobileMenuItems';
import { Popover } from '../Popover';
import { SimpleErrorBoundary } from '../SimpleErrorBoundary';
import { SiteNavMenu, useSiteNavMenuItems } from './components/SiteNavMenu';
import { ThemeToggles } from './components/SiteNavMenu/components/ThemeToggles';

type PageWrapperPropsDef = PropsWithChildren<{
  suspenseFallback?: ReactNode;
  title?: string;
  wideOnMobile?: boolean;
}>;

export const PageWrapper = (props: PageWrapperPropsDef) => {
  const {
    children,
    suspenseFallback = 'Loading...',
    title = 'Collection Tracker',
    wideOnMobile,
  } = props;

  const { accountNavItems, primaryNavItems } = useSiteNavMenuItems();

  const user = useUserContext();

  const isImpersonating = user.impersonatedBy;

  return (
    <div className="p-1 md:p-4 h-dvh overflow-hidden size-full grid grid-rows-[auto_1fr] gap-2 md:gap-4">
      <header className="grid gap-2 md:gap-4">
        {isImpersonating && (
          <div className="px-2 py-1 bg-amber-400 text-black text-center">
            Impersonating {user.email}
          </div>
        )}
        <div className="py-1 md:py-0 grid grid-cols-[1fr_auto] gap-2 w-full justify-between text-white">
          <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_auto_1fr] items-center gap-2">
            <MobileNavMenu
              BottomContent={({ closeMenu }) => {
                return (
                  <ListMobileMenuItems
                    closeMenu={closeMenu}
                    items={accountNavItems}
                  />
                );
              }}
              items={primaryNavItems}
              TopContent={ThemeToggles}
            />

            <Link className="hidden md:block text-inherit" to="/">
              <ListAltIcon className="text-4xl text-inherit" fontSize="large" />
            </Link>

            <Link
              className="block text-inherit overflow-hidden"
              to={user?.id ? '/collections' : '/'}
            >
              <h1 className="text-inherit text-2xl md:text-3xl block text-ellipsis whitespace-nowrap overflow-hidden w-full">
                {title}
              </h1>
            </Link>
          </div>

          <div className="flex gap-2 md:gap-4">
            <Popover
              aria-label="Buy me a coffee"
              Description="Buy me a coffee!"
              Trigger={() => {
                return (
                  <a
                    aria-label="Buy me a coffee"
                    className="text-white hover:text-primary-300 dark:hover:text-theme-link-hover"
                    href="https://buymeacoffee.com/collectiontracker"
                    target="_blank"
                  >
                    <CoffeeIcon />
                  </a>
                );
              }}
            />

            <Popover
              aria-label="View GitHub"
              Description="This project is open source!"
              Trigger={() => {
                return (
                  <a
                    aria-label="View GitHub"
                    className="text-white hover:text-primary-300 dark:hover:text-theme-link-hover"
                    href={githubUrl.repo}
                    target="_blank"
                  >
                    <GitHubIcon />
                  </a>
                );
              }}
            />
          </div>
        </div>

        <QueryErrorResetBoundary>
          {({ reset }) => {
            return (
              <SimpleErrorBoundary onReset={reset}>
                <Suspense>
                  <SiteNavMenu />
                </Suspense>
              </SimpleErrorBoundary>
            );
          }}
        </QueryErrorResetBoundary>
      </header>

      <main
        className={twJoin(
          'relative size-full',
          wideOnMobile ? 'p-2' : 'p-4',
          'md:p-4',
          'bg-theme-surface-1 rounded-3xl md:rounded-4xl',
        )}
      >
        <QueryErrorResetBoundary>
          {({ reset }) => {
            return (
              <SimpleErrorBoundary onReset={reset}>
                <div className="size-full relative top-0 right-0 bottom-0 left-0">
                  <div className="size-full absolute top-0 right-0 bottom-0 left-0">
                    <Suspense fallback={suspenseFallback}>{children}</Suspense>
                  </div>
                </div>
              </SimpleErrorBoundary>
            );
          }}
        </QueryErrorResetBoundary>
      </main>
    </div>
  );
};
