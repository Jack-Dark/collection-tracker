import { twMerge } from 'tailwind-merge';

import type { ChartWrapperPropsDef } from './ChartWrapper.types';

export const ChartWrapper = (props: ChartWrapperPropsDef) => {
  const { children, className, title } = props;

  return (
    <div
      className={twMerge(
        'grid gap-4 min-w-125 **:[svg]:focus:outline-0',
        className,
      )}
    >
      <h2 className="text-center">{title}</h2>
      <div className="flex justify-center">{children}</div>
    </div>
  );
};
