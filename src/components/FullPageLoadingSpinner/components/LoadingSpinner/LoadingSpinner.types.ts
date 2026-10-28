import type { HTMLAttributes } from 'react';

export type LoadingSpinnerPropsDef = {
  enableShadow?: boolean;
  variant?: 'color' | 'mono';
} & HTMLAttributes<HTMLDivElement>;
