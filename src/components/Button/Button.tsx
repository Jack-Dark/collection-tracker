import type { ButtonProps as MuiButtonProps } from '@base-ui/react';
import type { JSXElementConstructor, PropsWithChildren } from 'react';

import { Button as MuiButton } from '@base-ui/react';
import { twMerge } from 'tailwind-merge';

import { LoadingSpinner } from '../FullPageLoadingSpinner/components/LoadingSpinner';

export const buttonVariants = [
  'primary',
  'secondary',
  'mono',
  'ghost',
  'alert',
] as const;

export type ButtonVariantDef = (typeof buttonVariants)[number];

type ButtonSizeDef = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';

export type ButtonPropsDef = Omit<MuiButtonProps, 'form'> & {
  className?: string;
  disabled?: boolean;
  iconPosition?: (typeof iconPositions)[keyof typeof iconPositions];
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
        Icon?: JSXElementConstructor<{ className?: string }>;
        text: string;
      }
    | PropsWithChildren<{
        'aria-label'?: string;
        Icon?: JSXElementConstructor<{ className?: string }>;
        text?: never;
      }>
    | {
        'aria-label': string;
        children?: never;
        Icon: JSXElementConstructor<{ className?: string }>;
        text?: never;
      }
  );

const iconPositions = {
  left: 'left',
  right: 'right',
} as const;

export const Button = ({
  children,
  className = '',
  disabled = false,
  Icon,
  iconPosition = iconPositions.left,
  processing = false,
  size = 'md',
  text = '',
  type = 'button',
  variant = 'primary',
  ...rest
}: ButtonPropsDef) => {
  return (
    <MuiButton
      disabled={disabled || processing}
      {...rest}
      className={twMerge(
        'btn',
        getBtnSizeClass(size),
        getBtnVariantClass(variant),
        'flex items-center justify-center gap-2',
        className,
      )}
      type={type}
    >
      {iconPosition === iconPositions.left &&
        (processing ? (
          <LoadingSpinner className="size-5" variant="mono" />
        ) : (
          Icon && <Icon className="icon" />
        ))}

      {children || text}

      {iconPosition === iconPositions.right &&
        (processing ? (
          <LoadingSpinner className="size-5" variant="mono" />
        ) : (
          Icon && <Icon className="icon" />
        ))}
    </MuiButton>
  );
};

const getBtnSizeClass = (size: ButtonSizeDef) => {
  switch (size) {
    case 'xs':
      return 'btn-xs';

    case 'sm':
      return 'btn-sm';

    case 'lg':
      return 'btn-lg';

    case 'xl':
      return 'btn-xl';

    case '2xl':
      return 'btn-2xl';

    case 'custom':
      return 'btn-custom';

    default:
      return 'btn-md';
  }
};

const getBtnVariantClass = (variant: ButtonVariantDef) => {
  switch (variant) {
    case 'secondary':
      return 'btn-secondary';

    case 'mono':
      return 'btn-mono';

    case 'ghost':
      return 'btn-ghost';

    case 'alert':
      return 'btn-alert';

    default:
      return 'btn-primary';
  }
};
