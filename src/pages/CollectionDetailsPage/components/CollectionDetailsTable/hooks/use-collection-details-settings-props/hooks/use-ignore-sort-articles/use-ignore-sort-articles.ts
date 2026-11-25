import { useOnUpdateCollectionItemsQueries } from '../../../../../../hooks/use-on-update-collection-items-queries';

export const articlesToIgnore = ['the', 'a', 'an'] as const;

export const articlesToIgnorePattern = new RegExp(
  `^${articlesToIgnore
    .map((article) => {
      return `(${article}\\s+)`;
    })
    .join('|')}`,
  'i',
);

export const useIgnoreSortArticles = () => {
  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const setIgnoreSortArticles = (ignoreSortArticles: boolean) => {
    onUpdateCollectionItemsQueries({ ignoreSortArticles });
  };

  return {
    ignoreSortArticles: searchQueries.ignoreSortArticles,
    setIgnoreSortArticles,
  };
};
