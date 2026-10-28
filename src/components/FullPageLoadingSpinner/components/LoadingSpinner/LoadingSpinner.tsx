import { twMerge } from 'tailwind-merge';

import type { LoadingSpinnerPropsDef } from './LoadingSpinner.types';

export const LoadingSpinner = (props: LoadingSpinnerPropsDef) => {
  const { className, enableShadow, variant = 'mono' } = props;

  return (
    <div
      aria-label="Loading…"
      className={twMerge(
        'size-5 border-2',
        variant === 'color'
          ? 'border-white border-t-primary-600'
          : variant === 'light'
            ? 'border-white border-t-[rgba(255,255,255,0.4)]'
            : 'border-gray-500 border-t-[rgba(0,0,0,0.1)]',
        'rounded-full animate-spin',
        enableShadow
          ? 'shadow-[0_0_5px_rgba(0,0,0,0.25),inset_0_0_5px_rgba(0,0,0,0.25)]'
          : '',
        className,
      )}
      role="status"
    />
  );
};
