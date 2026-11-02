import type { MenuItemLabelPropsDef } from './MenuItemLabel.types';

export const MenuItemLabel = (props: MenuItemLabelPropsDef) => {
  const { Label } = props;

  return typeof Label === 'function' ? <Label /> : Label;
};
