import { useOnUpdateCollectionItemsQueries } from '../../../../../../hooks/use-on-update-collection-items-queries';

export const articlesToIgnore = ['the', 'a', 'an'];

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
