import type { JSXElementConstructor } from 'react';

import { ScrollArea } from '@base-ui/react';
import { Drawer } from '@base-ui/react/drawer';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useLayoutEffect, useState } from 'react';

import type { NavMenuItem } from '../../NavMenu.types';

import { ListMobileMenuItems } from './components/ListMobileMenuItems';

export const MobileNavMenu = (props: {
  BottomContent?: JSXElementConstructor<{ closeMenu: () => void }>;
  items: NavMenuItem[];
  TopContent?: JSXElementConstructor<{ closeMenu: () => void }>;
}) => {
  const {
    BottomContent = () => {
      return <div />;
    },
    items,
    TopContent = () => {
      return <div />;
    },
  } = props;

  const [open, setOpen] = useState<boolean>(false);

  const closeMenu = () => {
    setOpen(false);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      const mobileBreakSize = 768;
      const viewportWidth = window.innerWidth;

      if (viewportWidth >= mobileBreakSize) {
        setOpen(false);
      }
    };

    if (open) {
      window?.addEventListener('resize', handleResize);
    } else {
      window?.removeEventListener('resize', handleResize);
    }

    return () => {
      window?.removeEventListener('resize', handleResize);
    };
  }, [open]);

  return (
    <Drawer.Root onOpenChange={setOpen} open={open} swipeDirection="left">
      <div className="md:hidden">
        <Drawer.Trigger className="flex justify-center items-center p-1 text-theme-t1 hover:text-theme-link-hover cursor-pointer">
          <MenuIcon aria-label="Menu" />
        </Drawer.Trigger>

        <Drawer.SwipeArea />
      </div>

      <Drawer.Portal
        className="fixed block transition-transform transition-discrete duration-300"
        keepMounted
      >
        <Drawer.Backdrop className="[--backdrop-opacity:0.2] dark:[--backdrop-opacity:0.3] fixed inset-0 min-h-dvh min-w-dvw bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute" />
        <Drawer.Viewport className="fixed inset-0">
          <Drawer.Popup className="size-full grid grid-rows-[auto_1fr] max-w-80 bg-theme-surface-1 dark:bg-theme-surface-2 border-r border-theme-divider-1 dark:border-theme-divider-2 overflow-y-auto overscroll-contain touch-auto [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]">
            <div className="flex justify-between items-center p-2 border-b border-theme-divider-1 dark:border-theme-divider-2">
              <TopContent closeMenu={closeMenu} />

              <Drawer.Close className="cursor-pointer p-1">
                <CloseIcon
                  aria-label="Close"
                  className="text-theme-t1 hover:text-theme-link-hover"
                />
              </Drawer.Close>
            </div>
            <div className="overflow-hidden">
              <ScrollArea.Root className="h-full overscroll-contain transition-transform duration-600 ease-[cubic-bezier(0.45,1.005,0,1.005)] group-data-starting-style:translate-y-[100dvh] group-data-ending-style:pointer-events-none">
                <ScrollArea.Viewport className="h-full overscroll-contain touch-auto">
                  <ScrollArea.Content className="h-full min-h-full">
                    <Drawer.Content className="h-full min-h-full grid grid-rows-[1fr_auto] gap-5 py-4">
                      <ListMobileMenuItems
                        closeMenu={closeMenu}
                        items={items}
                      />

                      <BottomContent closeMenu={closeMenu} />
                    </Drawer.Content>
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
              </ScrollArea.Root>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
