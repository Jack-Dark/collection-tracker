import type { HTMLAttributes } from 'react';

export type LoadingSpinnerPropsDef = {
  enableShadow?: boolean;
  variant?: 'color' | 'light' | 'dark';
} & HTMLAttributes<HTMLDivElement>;
