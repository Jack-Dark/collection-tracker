import { twMerge } from 'tailwind-merge';

import type { LoadingSpinnerPropsDef } from './LoadingSpinner.types';

export const LoadingSpinner = (props: LoadingSpinnerPropsDef) => {
  const { className, enableShadow, variant = 'color' } = props;

  return (
    <div className="flex justify-center">
      <div
        aria-label="Loading…"
        className={twMerge(
          'size-10 border-2 rounded-full animate-spin',
          variant === 'color'
            ? 'border-white border-t-primary-600'
            : 'light:border-gray-500 light:border-t-[rgba(0,0,0,0.1)] dark:border-white dark:border-t-[rgba(255,255,255,0.4)] ',
          enableShadow
            ? 'shadow-[0_0_5px_rgba(0,0,0,0.25),inset_0_0_5px_rgba(0,0,0,0.25)]'
            : '',
          className,
        )}
        role="status"
      />
    </div>
  );
};
