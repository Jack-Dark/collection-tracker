import type { BaseChartItemDef } from '../Charts.types';

export const generateTooltipText = (item: BaseChartItemDef): string => {
  return `${item.label} (${item.value.toLocaleString()} items)`;
};
