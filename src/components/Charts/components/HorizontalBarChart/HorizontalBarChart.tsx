import { defineChart, barX } from '@tanstack/charts';
import { Chart } from '@tanstack/charts/react/tooltip';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';

import type { HorizontalBarChartPropsDef } from './HorizontalBarChart.types';

import { generateTooltipText } from '../../helpers/generate-tooltip-text';
import { barChartColorsList } from './HorizontalBarChart.constants';

export const HorizontalBarChart = (props: HorizontalBarChartPropsDef) => {
  const { ariaLabel, items } = props;

  const height = Math.max(100, items.length * 20);

  const formattedItems = items.map((item, index) => {
    const colorsIndex = index % barChartColorsList.length;

    return {
      ...item,
      color: barChartColorsList[colorsIndex],
      tooltipText: generateTooltipText(item),
    };
  });

  return (
    <Chart
      ariaLabel={ariaLabel}
      definition={defineChart({
        marks: [
          barX(formattedItems, {
            fill: ({ color }) => {
              return color;
            },
            x: 'value',
            y: ({ label, value }) => {
              return `${label} (${value})`;
            },
          }),
        ],
        scales: {
          x: {
            grid: true,
            nice: true,
            scale: scaleLinear,
          },
          y: {
            guides: true,
            scale: () => {
              return scaleBand().padding(0.16);
            },
          },
        },
        tooltip: {
          format: ({ datum }) => {
            return datum.tooltipText;
          },
          use: tooltip,
        },
      })}
      height={height}
    />
  );
};
