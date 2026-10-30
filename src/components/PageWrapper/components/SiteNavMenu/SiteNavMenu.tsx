import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { useImpersonateUserStop } from '#/api/routes/users/impersonate-user-stop/impersonate-user-stop.react-query';
import { DesktopNavMenu } from '#/components/NavMenu/components/DesktopNavMenu';
import { useUserContext } from '#/hooks/use-user-context';

import type { RouterPath } from '../../../../types';
import type { NavMenuItem } from '../../../NavMenu/NavMenu.types';

import { useGetNavMenuCollections } from '../../../../api/routes/collections/get-nav-menu-collections/get-nav-menu-collections.react-query';
import { Route as CollectionsRoute } from '../../../../routes/_protected/collections';
import { Route as CollectionRoute } from '../../../../routes/_protected/collections/$id';
import { ThemeToggles } from './components/ThemeToggles';

export const SiteNavMenu = () => {
  const { accountNavItems, primaryNavItems } = useSiteNavMenuItems();

  return (
    <div className="hidden md:flex justify-between items-center bg-theme-surface-1 text-theme-t1 rounded-full">
      <DesktopNavMenu items={primaryNavItems} />

      <div className="flex items-center">
        <DesktopNavMenu items={accountNavItems} />

        <div className="py-1 px-1 md:px-3 flex justify-center ">
          <ThemeToggles />
        </div>
      </div>
    </div>
  );
};

export const useSiteNavMenuItems = () => {
  const { data } = useGetNavMenuCollections({
    placeholderData: {
      collections: [],
    },
    requestArgs: {},
  });

  const { collections } = data;

  const { onImpersonateUserStop } = useImpersonateUserStop();

  const user = useUserContext();

  const isLoggedOut = !user?.id;

  const primaryNavItems: NavMenuItem[] = [
    isLoggedOut
      ? {
          href: '/' satisfies RouterPath,
          label: 'Home',
        }
      : {
          href: CollectionsRoute.fullPath,
          items: collections.map((collection) => {
            return {
              href: CollectionRoute.fullPath.replace(
                '$id',
                String(collection.id),
              ),
              label: collection.name,
            };
          }),
          label: 'Collections',
        },
    {
      href: '/about' satisfies RouterPath,
      label: 'About',
    },
    {
      href: '/why-its-important' satisfies RouterPath,
      label: "Why it's Important",
    },
  ];

  const accountNavItems: NavMenuItem[] = [
    isLoggedOut
      ? {
          href: '/sign-in' satisfies RouterPath,
          Icon: AccountCircleIcon,
          items: [
            {
              href: '/sign-in' satisfies RouterPath,
              label: 'Log In',
            },
            {
              href: '/sign-up' satisfies RouterPath,
              label: 'Sign Up',
            },
          ],
          label: 'Log In / Sign Up',
        }
      : {
          href: '/account' satisfies RouterPath,
          Icon: AccountCircleIcon,
          items: [
            {
              hidden: user?.role !== 'admin',
              href: '/admin/users' satisfies RouterPath,
              Icon: AdminPanelSettingsIcon,
              label: 'Admin: Users',
            },
            user.impersonatedBy
              ? {
                  href: '/sign-in',
                  label: 'Stop Impersonating',
                  onClick: onImpersonateUserStop,
                }
              : {
                  href: '/sign-out',
                  label: 'Log Out',
                },
          ],
          label: 'Account',
        },
  ];

  return { accountNavItems, primaryNavItems };
};
