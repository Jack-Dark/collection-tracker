import { defineChart } from '@tanstack/charts';
import { polar, radialText, pie, radialArc } from '@tanstack/charts/polar';
import { Chart } from '@tanstack/charts/react/tooltip';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';

import type { GaugeChartPropsDef } from './GaugeChart.types';

import { generateTooltipText } from '../../helpers/generate-tooltip-text';

export const GaugeChart = (props: GaugeChartPropsDef) => {
  const { ariaLabel, items, totalItems } = props;

  const radialCenterLabels = (
    props: {
      fontSize?: number;
      totalDy?: number;
    } = {},
  ) => {
    const { fontSize = 36, totalDy = 0 } = props;

    return polar({
      marks: [
        radialText(
          [
            {
              angle: 0,
              radius: 0,
              text: `${new Intl.NumberFormat('en-US', {
                style: 'percent',
              }).format(items[0].value / totalItems)}`,
              tooltipText: `${items[0].value.toLocaleString()} out of ${totalItems.toLocaleString()}`,
            },
          ],
          {
            angle: 'angle',
            dy: totalDy,
            fill: 'var(--ts-chart-title)',
            fontSize,
            fontWeight: 700,
            id: `radial-percent-label`,
            radius: 'radius',
            text: 'text',
          },
        ),
      ],
      scales: {
        angle: { scale: scaleLinear().domain([0, 1]) },
        radius: { scale: scaleLinear().domain([0, 1]) },
      },
    });
  };

  const formattedItems = items.map((item) => {
    return {
      ...item,
      tooltipText: generateTooltipText(item),
    };
  });

  const arcs = pie(formattedItems, {
    value: 'value',
  });

  const gaugeColors = ['var(--ts-chart-1)', 'var(--ts-chart-empty)'] as const;

  return (
    <Chart
      ariaLabel={ariaLabel}
      aspectRatio={1}
      definition={defineChart({
        color: {
          range: gaugeColors,
        },
        marks: [
          polar({
            inset: 0,
            marks: [
              radialArc(arcs, {
                color: 'value',
                innerRadius: ({ radius }) => {
                  return radius * 0.72;
                },
                key: 'value',
              }),
            ],
            scales: {
              angle: null,
              radius: null,
            },
          }),
          radialCenterLabels(),
        ],
        scales: {
          x: null,
          y: null,
        },
        tooltip: {
          format: ({ datum }) => {
            return datum.tooltipText;
          },
          use: tooltip,
        },
      })}
      height={250}
      width={250}
    />
  );
};
