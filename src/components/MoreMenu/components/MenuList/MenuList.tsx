import { Menu } from '@base-ui/react';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react';

import type { MenuPropsDef } from '../../MoreMenu.types';

import { ConditionalWrapper } from '../../../ConditionalWrapper';
import { MenuArrowSvg } from './components/MenuArrowSvg';
import { MenuItemLabel } from './components/MenuItemLabel';
import { getMenuItemClasses } from './MenuList.helpers';

export const MenuList = (props: MenuPropsDef) => {
  const {
    align = 'center',
    alignOffset,
    items,
    side = 'bottom',
    sideOffset = 8,
  } = props;

  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        className="outline-hidden"
        side={side}
        sideOffset={sideOffset}
      >
        <Menu.Popup className="relative bg-theme-surface-1 text-theme-t1 border border-theme-divider-1 dark:border-theme-divider-2 rounded-sm py-1 shadow-lg">
          <Menu.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
            <MenuArrowSvg />
          </Menu.Arrow>

          {items
            .filter(({ hidden }) => {
              return !hidden;
            })
            .map((itemProps) => {
              const {
                active,
                addSeparator,
                closeOnClick = true,
                disabled,
                group,
                href,
                key,
                Label,
                onClick,
                subMenu,
                target,
              } = itemProps;

              return (
                <Fragment key={typeof Label === 'string' ? Label : key}>
                  {group?.length ? (
                    <Menu.Group>
                      <Menu.GroupLabel
                        className={getMenuItemClasses({ active, disabled })}
                        data-group-label=""
                      >
                        <MenuItemLabel Label={Label} />
                      </Menu.GroupLabel>

                      {group.map((groupProps) => {
                        const {
                          addSeparator,
                          closeOnClick = true,
                          disabled,
                          href,
                          key,
                          Label,
                          onClick,
                          target,
                        } = groupProps;

                        return (
                          <Fragment
                            key={typeof Label === 'string' ? Label : key}
                          >
                            <Menu.Item
                              className={getMenuItemClasses({
                                active,
                                disabled,
                              })}
                              closeOnClick={closeOnClick}
                              data-clickable={href || onClick ? '' : undefined}
                              data-disabled={disabled ? '' : undefined}
                              disabled={disabled}
                              onClick={disabled ? undefined : onClick}
                            >
                              <ConditionalWrapper
                                condition={!!href && !disabled}
                                Wrapper={({ children }) => {
                                  return (
                                    <Link target={target} to={href}>
                                      {children}
                                    </Link>
                                  );
                                }}
                              >
                                <MenuItemLabel Label={Label} />
                              </ConditionalWrapper>
                            </Menu.Item>
                            {addSeparator && (
                              <Menu.Separator className="mx-4 my-1.5 h-px bg-theme-divider" />
                            )}
                          </Fragment>
                        );
                      })}
                    </Menu.Group>
                  ) : subMenu?.items?.length ? (
                    <Menu.SubmenuRoot
                      disabled={subMenu?.disabled}
                      open={subMenu?.open && !subMenu?.disabled}
                    >
                      <Menu.SubmenuTrigger
                        className={getMenuItemClasses({ active, disabled })}
                        disabled={disabled}
                      >
                        <ConditionalWrapper
                          condition={!!href && !disabled}
                          Wrapper={({ children }) => {
                            return (
                              <Link target={target} to={href}>
                                {children}
                              </Link>
                            );
                          }}
                        >
                          <MenuItemLabel Label={Label} />
                        </ConditionalWrapper>
                      </Menu.SubmenuTrigger>
                      <MenuList
                        {...subMenu}
                        align={
                          !subMenu.align && subMenu?.items?.length > 1
                            ? 'start'
                            : subMenu.align
                        }
                        side={subMenu.side || 'left'}
                      />
                    </Menu.SubmenuRoot>
                  ) : (
                    <Menu.Item
                      className={getMenuItemClasses({ active, disabled })}
                      closeOnClick={closeOnClick}
                      data-clickable={href || onClick ? '' : undefined}
                      data-disabled={disabled ? '' : undefined}
                      disabled={disabled}
                      onClick={disabled ? undefined : onClick}
                    >
                      <ConditionalWrapper
                        condition={!!href && !disabled}
                        Wrapper={({ children }) => {
                          return (
                            <Link target={target} to={href}>
                              {children}
                            </Link>
                          );
                        }}
                      >
                        <MenuItemLabel Label={Label} />
                      </ConditionalWrapper>
                    </Menu.Item>
                  )}
                  {addSeparator && (
                    <Menu.Separator className="mx-4 my-1.5 h-px bg-theme-divider" />
                  )}
                </Fragment>
              );
            })}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
};
