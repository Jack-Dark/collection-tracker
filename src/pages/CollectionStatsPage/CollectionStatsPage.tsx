import type { RouteComponent } from '@tanstack/react-router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams } from '@tanstack/react-router';

import { useGetCollectionStatsById } from '#/api/routes/collection-items/get-collection-stats-by-id/get-collection-stats-by-id.react-query';
import { Button } from '#/components/Button';
import { PageWrapper } from '#/components/PageWrapper';

import { ChartWrapper } from '../../components/Charts/components/ChartWrapper';
import { GaugeChart } from '../../components/Charts/components/GaugeChart';
import { HorizontalBarChart } from '../../components/Charts/components/HorizontalBarChart';

export const CollectionStatsPage: RouteComponent = () => {
  const { id } = useParams({ from: '/_protected/collections/$id_/stats' });

  const collectionId = Number(id);

  const { data } = useGetCollectionStatsById({
    placeholderData: {
      customFields: [],
      isSpecialEditionItems: [],
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
        <Link className="mr-auto" params={{ id }} to="/collections/$id">
          <Button
            icon={<ArrowBackIcon fontSize="inherit" />}
            text="Back"
            variant="mono"
          />
        </Link>

        <div className="flex justify-center size-full overflow-auto">
          <div className="size-full grid items-baseline gap-15 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-400 mb-10 md:mb-20 px-4">
            {data.customFields.map(({ id, items, name, type }) => {
              if (!items.length) {
                return null;
              }

              const ariaLabel = `${name} Chart`;

              switch (type) {
                case 'boolean':
                  return (
                    <ChartWrapper key={id} title={name}>
                      <GaugeChart
                        ariaLabel={ariaLabel}
                        items={items}
                        totalItems={data.totalItems}
                      />
                    </ChartWrapper>
                  );

                case 'number':
                  return (
                    <ChartWrapper
                      className="min-w-125 md:col-span-2"
                      key={id}
                      title={name}
                    >
                      <HorizontalBarChart ariaLabel={ariaLabel} items={items} />
                    </ChartWrapper>
                  );

                case 'string':
                  return (
                    <ChartWrapper
                      className="min-w-125 md:col-span-2 lg:col-span-3"
                      key={id}
                      title={name}
                    >
                      <HorizontalBarChart ariaLabel={ariaLabel} items={items} />
                    </ChartWrapper>
                  );

                default:
                  return null;
              }
            })}

            <ChartWrapper key="is-special-edition" title="Is Special Edition">
              <GaugeChart
                ariaLabel="Is Special Edition Chart"
                items={data.isSpecialEditionItems}
                totalItems={data.totalItems}
              />
            </ChartWrapper>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
