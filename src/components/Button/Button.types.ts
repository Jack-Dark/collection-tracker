import type { ButtonProps as MuiButtonProps } from '@base-ui/react';
import type { ReactNode, PropsWithChildren } from 'react';

import type { ObjectValues } from '#/types';

import type { buttonVariants, iconPositions } from './Button.constants';

export type ButtonVariantDef = (typeof buttonVariants)[number];

export type ButtonSizeDef = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';

export type ButtonPropsDef = Omit<MuiButtonProps, 'form'> & {
  className?: string;
  disabled?: boolean;
  iconPosition?: ObjectValues<typeof iconPositions>;
  processing?: boolean;
  /** Applies standardized padding, font-size, and line-height styling. `'custom'` does not apply any. */
  size?: ButtonSizeDef;
  /** Set to `'submit'` for form submission. */
  type?: 'button' | 'submit';
  variant?: ButtonVariantDef;
} & (
    | {
        'aria-label'?: string;
        children?: never;
        icon?: ReactNode;
        text: string;
      }
    | PropsWithChildren<{
        'aria-label'?: string;
        icon?: ReactNode;
        text?: never;
      }>
    | {
        'aria-label': string;
        children?: never;
        icon: ReactNode;
        text?: never;
      }
  );
