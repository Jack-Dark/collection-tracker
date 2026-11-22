import { Button as MuiButton } from '@base-ui/react';
import { twMerge } from 'tailwind-merge';

import type { ButtonPropsDef } from './Button.types';

import { LoadingSpinner } from '../FullPageLoadingSpinner/components/LoadingSpinner';
import { iconPositions } from './Button.constants';
import { getBtnSizeClass, getBtnVariantClass } from './Button.helpers';

export const Button = ({
  children,
  className = '',
  disabled = false,
  icon: Icon,
  iconPosition = iconPositions.left,
  processing = false,
  size,
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
        size ? getBtnSizeClass(size) : 'btn-sm md:btn-md',
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
          Icon
        ))}

      {children || text}

      {iconPosition === iconPositions.right &&
        (processing ? (
          <LoadingSpinner className="size-5" variant="mono" />
        ) : (
          Icon
        ))}
    </MuiButton>
  );
};
