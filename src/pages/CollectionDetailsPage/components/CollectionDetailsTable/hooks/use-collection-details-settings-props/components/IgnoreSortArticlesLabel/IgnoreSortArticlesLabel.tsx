import { useOnUpdateCollectionItemsQueries } from '#/pages/CollectionDetailsPage/hooks/use-on-update-collection-items-queries';

import { articlesToIgnore } from '../../hooks/use-ignore-sort-articles';
import { FormatLabelWithStatusIcon } from '../FormatLabelWithStatusIcon';

export const IgnoreSortArticlesLabel = () => {
  const { searchQueries } = useOnUpdateCollectionItemsQueries();

  return (
    <FormatLabelWithStatusIcon active={searchQueries.ignoreSortArticles}>
      <p>Ignore articles when sorting</p>
      <span className="text-theme-t2 text-sm">
        (Values that start with{' '}
        {articlesToIgnore.reduce((acc, value, index) => {
          const isLastIndex = index === articlesToIgnore.length - 1;
          const formattedValue = `"${value}"`;

          if (isLastIndex) {
            return `${acc} or ${formattedValue}`;
          } else {
            return `${acc}${formattedValue}, `;
          }
        }, '')}
        )
      </span>
    </FormatLabelWithStatusIcon>
  );
};
