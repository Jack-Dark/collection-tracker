import { MobileNavMenu } from '#/components/NavMenu/components/MobileNavMenu';

import { ListMobileMenuItems } from '../../../NavMenu/components/MobileNavMenu/components/ListMobileMenuItems';
import { useSiteNavMenuItems } from '../SiteDesktopNavMenu';
import { ThemeToggles } from '../SiteDesktopNavMenu/components/ThemeToggles';

export const SiteMobileNavMenu = () => {
  const { accountNavItems, primaryNavItems } = useSiteNavMenuItems();

  return (
    <MobileNavMenu
      BottomContent={({ closeMenu }) => {
        return (
          <ListMobileMenuItems closeMenu={closeMenu} items={accountNavItems} />
        );
      }}
      items={primaryNavItems}
      TopContent={ThemeToggles}
    />
  );
};
