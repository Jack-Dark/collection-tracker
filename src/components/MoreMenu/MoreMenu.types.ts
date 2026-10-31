import type { MenuPositionerProps } from '@base-ui/react';
import type { LinkProps } from '@tanstack/react-router';
import type { JSXElementConstructor, Key, ReactNode } from 'react';

export type MenuPropsDef = Pick<
  MenuPositionerProps,
  'align' | 'alignOffset' | 'side' | 'sideOffset'
> & {
  disabled?: boolean;
  Icon?: JSXElementConstructor<{}>;
  items: MenuItemDef[];
  open?: boolean;
};

export type MenuItemDef = {
  active?: boolean;
  addSeparator?: boolean;
  closeOnClick?: boolean;
  disabled?: boolean;
  hidden?: boolean;
} & MenuItemLabelPropsDef &
  (
    | (MenuItemBehaviorPropsDef & {
        group?: never;
        subMenu?: never;
      })
    | (MenuItemBehaviorPropsDef & {
        group?: never;
        subMenu?: MenuPropsDef;
      })
    | {
        group?: MenuItemGroupItemPropsDef[];
        href?: never;
        onClick?: never;
        subMenu?: never;
        target?: never;
      }
  );

type MenuItemLabelPropsDef =
  | {
      key?: never;
      Label: string;
    }
  | {
      key: Key;
      Label: ReactNode | JSXElementConstructor<{}>;
    };

type MenuItemBehaviorPropsDef =
  | {
      href: LinkProps['to'];
      onClick?: never;
      target?: string;
    }
  | {
      href?: never;
      onClick: () => void | Promise<void>;
      target?: never;
    };

type MenuItemGroupItemPropsDef = Omit<MenuItemDef, 'subMenu' | 'group'>;
