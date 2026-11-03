import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
} from '@base-ui/react';
import type { HTMLAttributes, JSXElementConstructor } from 'react';

import type { FieldWrapperProps } from '../FieldWrapper/FieldWrapper.types';

export type DefaultSelectItemDef = {
  [k: string]: any;
  disabled?: boolean;
  placeholder?: boolean;
  separator?: true;
};

export type SelectFieldPropsDef<TItem extends DefaultSelectItemDef> = Omit<
  SelectRootProps<TItem>,
  'items' | 'onValueChange' | 'defaultValue'
> & {
  idProperty?: keyof TItem;
  items: TItem[];
  keyPrefix?: string;
  labelProperty?: keyof TItem;
  onValueChange: (item: TItem | null) => void | Promise<void>;
  RenderItem?: JSXElementConstructor<
    HTMLAttributes<HTMLElement> & { item: TItem }
  >;
  RenderValue?: JSXElementConstructor<
    HTMLAttributes<HTMLElement> & { item: TItem }
  >;
} & FieldWrapperProps &
  Pick<SelectValueProps, 'placeholder'> &
  Pick<SelectTriggerProps, 'aria-label' | 'autoFocus'>;
