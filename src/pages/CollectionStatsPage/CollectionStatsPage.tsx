import type { RouteComponent } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { barX, barY, defineChart } from '@tanstack/charts';
import { polar, radialArc } from '@tanstack/charts/polar';
import { Chart } from '@tanstack/charts/react/tooltip';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { tooltip } from '@tanstack/charts/tooltip';
import { Link, useParams } from '@tanstack/react-router';

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

  // const ids: readonly GaugeDatum['id'][] = ['value', 'remainder']
  const colors = ['#ef4444', '#e2e8f0'];

  return (
    <PageWrapper title={`${data.name} - Stats`}>
      <div className="h-full overflow-auto grid gap-10">
        <Link params={{ id }} to="/collections/$id">
          <Button Icon={NavigateBeforeIcon} text="Back" variant="mono" />
        </Link>
        {data.customFields.map(({ id, items, name, type }) => {
          const ariaLabel = `${name} Chart`;

          switch (type) {
            case 'boolean':
              return (
                <ChartWrapper title={name}>
                  <Chart
                    ariaLabel={ariaLabel}
                    definition={defineChart({
                      color: { domain: ['value', 'label'], range: colors },
                      margin: 0,
                      marks: [
                        polar({
                          inset: 0,
                          marks: [
                            radialArc(items, {
                              // color: 'value',
                              innerRadius: ({ radius }) => {
                                return radius * 0.72;
                              },
                              key: 'value',
                            }),
                          ],
                          radiusRatio: 0.8,
                          scales: {
                            angle: null,
                            radius: null,
                          },
                        }),
                      ],
                      scales: {
                        x: null,
                        y: null,
                      },
                      tooltip,
                    })}
                    key={id}
                  />
                </ChartWrapper>
              );

            case 'number':
              return (
                <ChartWrapper title={name}>
                  <Chart
                    ariaLabel={ariaLabel}
                    definition={defineChart(
                      {
                        marks: [
                          barY(items, {
                            x: ({ label, value }) => {
                              return `${label} (${value})`;
                            },
                            y: 'value',
                          }),
                        ],
                        scales: {
                          x: {
                            scale: () => {
                              return scaleBand().padding(0.16);
                            },
                          },
                          y: {
                            grid: true,
                            nice: true,
                            scale: scaleLinear,
                          },
                        },
                        tooltip,
                      },
                      // {
                      //   keyboard: true,
                      //   tooltip: {
                      //     format: ({ datum }) => {
                      //       return datum.value;
                      //     },
                      //     use: tooltip,
                      //   },
                      // },
                    )}
                    key={id}
                  />
                </ChartWrapper>
              );

            case 'string':
              return (
                <ChartWrapper title={name}>
                  <Chart
                    ariaLabel={ariaLabel}
                    definition={defineChart(
                      {
                        marks: [
                          barX(items, {
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
                            scale: () => {
                              return scaleBand().padding(0.16);
                            },
                          },
                        },
                        tooltip,
                      },
                      // {
                      //   keyboard: true,
                      //   tooltip: {
                      //     format: ({ datum }) => {
                      //       return datum.value;
                      //     },
                      //     use: tooltip,
                      //   },
                      // },
                    )}
                    key={id}
                  />
                </ChartWrapper>
              );

            default:
              return null;
          }
        })}
      </div>
    </PageWrapper>
  );
};

const ChartWrapper = (props: PropsWithChildren<{ title: string }>) => {
  const { children, title } = props;

  return (
    <div className="grid gap-2">
      <h3 className="text-center">{title}</h3>
      {children}
    </div>
  );
};
