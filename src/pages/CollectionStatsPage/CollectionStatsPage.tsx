import type { RouteComponent } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { barX, defineChart } from '@tanstack/charts';
import { pie, polar, radialArc, radialText } from '@tanstack/charts/polar';
import { Chart } from '@tanstack/charts/react/tooltip';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { Link, useParams } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';

import { useGetCollectionStatsById } from '#/api/routes/collection-items/get-collection-stats-by-id/get-collection-stats-by-id.react-query';
import { Button } from '#/components/Button';
import { PageWrapper } from '#/components/PageWrapper';

export const CollectionStatsPage: RouteComponent = () => {
  const { id } = useParams({ from: '/_protected/collections/$id_/stats' });

  const collectionId = Number(id);

  const { data } = useGetCollectionStatsById({
    placeholderData: {
      customFields: [],
      name: 'Collection',
      totalItems: 0,
    },
    requestArgs: {
      collectionId,
    },
  });

  return (
    <PageWrapper title={`${data.name} - Stats`}>
      <div className="h-full grid grid-rows-[auto_1fr] gap-4">
        <Link params={{ id }} to="/collections/$id">
          <Button Icon={NavigateBeforeIcon} text="Back" variant="mono" />
        </Link>

        <div className="flex justify-center size-full overflow-auto">
          <div className="size-full grid items-baseline gap-15 grid-cols-1 lg:grid-cols-2 max-w-400">
            {data.customFields.map(({ id, items, name, type }) => {
              const ariaLabel = `${name} Chart`;
              const height = Math.max(100, items.length * 20);

              const colorsList = [
                'var(--ts-chart-1)',
                'var(--ts-chart-2)',
                'var(--ts-chart-3)',
                'var(--ts-chart-4)',
                'var(--ts-chart-5)',
                'var(--ts-chart-6)',
                'var(--ts-chart-7)',
                'var(--ts-chart-8)',
                'var(--ts-chart-9)',
                'var(--ts-chart-10)',
              ] as const;

              const itemsWithTooltipsAndColors = items.map((item, index) => {
                const colorsIndex = index % colorsList.length;

                return {
                  ...item,
                  color: colorsList[colorsIndex],
                  tooltipText: `${item.label} (${item.value} items)`,
                };
              });

              switch (type) {
                case 'boolean': {
                  const trueItemValue: number =
                    items.find(({ label }) => {
                      return label === String(true);
                    })?.value || 0;

                  const trueItem = {
                    label: 'Yes',
                    value: trueItemValue,
                  } satisfies (typeof items)[number];

                  const booleanItems = [
                    trueItem,
                    {
                      label: 'No',
                      value: data.totalItems - trueItem.value,
                    },
                  ].map((item) => {
                    return {
                      ...item,
                      tooltipText: `${item.label}: ${item.value}`,
                    };
                  }) satisfies typeof items;

                  const arcs = pie(booleanItems, {
                    value: 'value',
                  });

                  const gaugeColors = [
                    'var(--ts-chart-1)',
                    'var(--ts-chart-empty)',
                  ] as const;

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
                              }).format(trueItem.value / data.totalItems)}`,
                              tooltipText: `${trueItem.value} of ${data.totalItems}`,
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

                  return (
                    <ChartWrapper key={id} title={name}>
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
                    </ChartWrapper>
                  );
                }

                case 'number': {
                  return (
                    <ChartWrapper key={id} title={name}>
                      <Chart
                        ariaLabel={ariaLabel}
                        definition={defineChart({
                          marks: [
                            barX(itemsWithTooltipsAndColors, {
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
                    </ChartWrapper>
                  );
                }

                case 'string':
                  return (
                    <ChartWrapper
                      className="lg:col-span-2"
                      key={id}
                      title={name}
                    >
                      <Chart
                        ariaLabel={ariaLabel}
                        definition={defineChart({
                          marks: [
                            barX(itemsWithTooltipsAndColors, {
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
                    </ChartWrapper>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

const ChartWrapper = (
  props: PropsWithChildren<{ className?: string; title: string }>,
) => {
  const { children, className, title } = props;

  return (
    <div
      className={twMerge(
        'grid gap-4 min-w-125 **:[svg]:focus:outline-0',
        className,
      )}
    >
      <h3 className="text-center">{title}</h3>
      <div className="flex justify-center">{children}</div>
    </div>
  );
};
