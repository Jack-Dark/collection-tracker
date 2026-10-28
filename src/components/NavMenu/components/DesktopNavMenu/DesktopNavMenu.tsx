import { NavigationMenu } from '@base-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { twJoin } from 'tailwind-merge';

import type { NavMenuItem } from '../../NavMenu.types';

import { ConditionalWrapper } from '../../../ConditionalWrapper';
import { MenuArrowSvg } from '../../../MoreMenu/components/MenuList/components/MenuArrowSvg';
import { NavigationLinkWrapper } from '../NavigationLinkWrapper';

export const DesktopNavMenu = (props: { items: NavMenuItem[] }) => {
  const { items } = props;

  return (
    <NavigationMenu.Root className="p-1" closeDelay={300}>
      <NavigationMenu.List className="relative flex items-center gap-2">
        {items.map(
          ({ hidden, href, Icon, items, label, onClick, RenderItem }) => {
            const hasSubMenu = !!items?.some(({ hidden }) => {
              return !hidden;
            });

            return hidden ? null : (
              <NavigationMenu.Item
                className={twJoin(
                  // ? standard styles
                  'rounded-xs no-underline text-theme-t1',
                  // ? active status styles
                  'has-data-[status="active"]:bg-theme-surface-selected',
                  // ? hover styles
                  'hover:bg-theme-surface-highlighted',
                  'hover:has-data-[status="active"]:bg-theme-surface-highlighted',
                )}
                key={href || label}
                onClick={onClick}
              >
                <ConditionalWrapper
                  condition={hasSubMenu}
                  Wrapper={({ children }) => {
                    return (
                      <NavigationMenu.Trigger className="flex items-center justify-center rounded-xs text-inherit font-medium text-[0.925rem] [@media(min-width:32rem)]:text-base leading-6 select-none no-underline">
                        {children}
                        {items && (
                          <div className="py-2 pr-2 ">
                            <NavigationMenu.Icon className="inline-block transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180">
                              <ExpandMoreIcon />
                            </NavigationMenu.Icon>
                          </div>
                        )}
                      </NavigationMenu.Trigger>
                    );
                  }}
                >
                  <ConditionalWrapper
                    condition={!!href}
                    Wrapper={({ children }) => {
                      return (
                        <NavigationLinkWrapper
                          className="text-inherit"
                          href={href}
                        >
                          {children}
                        </NavigationLinkWrapper>
                      );
                    }}
                  >
                    <div className={twJoin(!href && 'px-3 py-2')}>
                      {RenderItem ? (
                        <RenderItem />
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          {Icon && <Icon />}
                          {label}
                        </div>
                      )}
                    </div>
                  </ConditionalWrapper>
                </ConditionalWrapper>

                {hasSubMenu && (
                  <NavigationMenu.Content
                    className={twJoin(
                      'py-1 min-w-40 rounded-xs',
                      'transition-[opacity,transform,translate] duration-[var(--duration)] ease-[var(--easing)]',
                      'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
                      'data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%]',
                      'data-[starting-style]:data-[activation-direction=right]:translate-x-[50%]',
                      'data-[ending-style]:data-[activation-direction=left]:translate-x-[50%]',
                      'data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]',
                    )}
                    keepMounted
                  >
                    <NavigationMenu.List className="list-none">
                      {items?.map(
                        (
                          { hidden, href, label, onClick, RenderItem },
                          index,
                        ) => {
                          return hidden ? null : (
                            <NavigationMenu.Item key={href || label || index}>
                              {RenderItem ? (
                                <div
                                  className={twJoin(!href && 'px-3 py-2')}
                                  onClick={onClick}
                                >
                                  <RenderItem />
                                </div>
                              ) : (
                                <NavigationLinkWrapper
                                  className={twJoin(
                                    // ? standard styles
                                    'block text-theme-t1',
                                    // ? active status styles
                                    'data-[status="active"]:bg-theme-surface-selected',
                                    // ? hover styles
                                    'hover:bg-theme-surface-highlighted',
                                    'hover:data-[status="active"]:bg-theme-surface-highlighted',
                                  )}
                                  href={href}
                                  onClick={onClick}
                                >
                                  {label}
                                </NavigationLinkWrapper>
                              )}
                            </NavigationMenu.Item>
                          );
                        },
                      )}
                    </NavigationMenu.List>
                  </NavigationMenu.Content>
                )}
              </NavigationMenu.Item>
            );
          },
        )}
      </NavigationMenu.List>

      <NavigationMenu.Portal className="hidden md:inline" keepMounted>
        <NavigationMenu.Positioner
          className="box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-[var(--duration)] ease-[var(--easing)] before:absolute before:content-[''] data-[instant]:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
          collisionAvoidance={{ side: 'none' }}
          collisionPadding={{ bottom: 5, left: 20, right: 20, top: 5 }}
          sideOffset={10}
          style={{
            ['--duration' as string]: '0.35s',
            ['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <NavigationMenu.Popup className="data-[ending-style]:easing-[ease] relative h-[var(--popup-height)] origin-[var(--transform-origin)] rounded-xs bg-theme-surface-1 text-theme-t1 shadow-lg shadow-gray-200 outline-1 outline-theme-divider-1 transition-[opacity,transform,width,height,scale,translate] duration-[var(--duration)] ease-[var(--easing)] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 w-[var(--popup-width)] dark:shadow-none dark:-outline-offset-1 dark:outline-theme-divider-2">
            <NavigationMenu.Arrow className="flex transition-[left] duration-[var(--duration)] ease-[var(--easing)] data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              <MenuArrowSvg />
            </NavigationMenu.Arrow>
            <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};
