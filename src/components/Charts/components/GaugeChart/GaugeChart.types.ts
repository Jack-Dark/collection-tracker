import type { BaseChartItemDef } from '../../Charts.types';

export type GaugeChartPropsDef = {
  ariaLabel: string;
  items: BaseChartItemDef[];
  totalItems: number;
};
