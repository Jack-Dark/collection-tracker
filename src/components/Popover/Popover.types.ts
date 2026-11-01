import type {
  PopoverTriggerProps,
  PopoverPositionerProps,
} from '@base-ui/react';
import type { JSXElementConstructor, ReactNode } from 'react';

export type PopoverPropsDef = {
  Description: string | JSXElementConstructor<{}>;
  /** If `true`, returns the `Trigger` without the `Popover`. */
  disabled?: boolean;
  isTriggerButton?: boolean;
  side?: PopoverPositionerProps['side'];
  Trigger?: ReactNode | JSXElementConstructor<{}>;
} & Pick<PopoverTriggerProps, 'delay' | 'aria-label'>;
