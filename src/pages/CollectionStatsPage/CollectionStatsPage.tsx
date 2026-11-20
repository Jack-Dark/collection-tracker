import type { RouteComponent } from '@tanstack/react-router';

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
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
                    <ChartWrapper key={id} title={name}>
                      <HorizontalBarChart ariaLabel={ariaLabel} items={items} />
                    </ChartWrapper>
                  );

                case 'string':
                  return (
                    <ChartWrapper
                      className="lg:col-span-2"
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
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
