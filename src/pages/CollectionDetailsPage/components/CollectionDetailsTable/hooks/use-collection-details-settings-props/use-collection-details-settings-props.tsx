import type { JSXElementConstructor, PropsWithChildren } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { MenuItemDef } from '#/components/MoreMenu/MoreMenu.types';
import type { TableSettingsMenuPropsDef } from '#/components/Table/components/TableSettingsMenu/TableSettingsMenu.types';

import { useOnUpdateCollectionItemsQueries } from '../../../../hooks/use-on-update-collection-items-queries';
import { useEnableAutoPopulateCustomFieldValues } from './hooks/use-enable-auto-populate-custom-field-values';
import {
  articlesToIgnore,
  useIgnoreSortArticles,
} from './hooks/use-ignore-sort-articles';

export const useCollectionDetailsSettingsProps = () => {
  const { ignoreSortArticles, setIgnoreSortArticles } = useIgnoreSortArticles();

  const MemoizedIgnoreSortArticlesLabel = useMemo(() => {
    return IgnoreSortArticlesLabel;
  }, []);

  const MemoizedEnableAutoPopulateCustomFieldValuesLabel = useMemo(() => {
    return EnableAutoPopulateCustomFieldValuesLabel;
  }, []);

  const {
    enableAutoPopulateCustomFieldValues,
    setEnableAutoPopulateCustomFieldValues,
  } = useEnableAutoPopulateCustomFieldValues();

  const router = useRouter();

  const items = [
    {
      active: ignoreSortArticles,
      closeOnClick: false,
      key: 'ignore-sort-articles',
      Label: MemoizedIgnoreSortArticlesLabel,
      onClick: () => {
        setIgnoreSortArticles(!ignoreSortArticles);
      },
    },
    {
      active: enableAutoPopulateCustomFieldValues,
      closeOnClick: false,
      key: 'auto-populate',
      Label: MemoizedEnableAutoPopulateCustomFieldValuesLabel,

      onClick: async () => {
        setEnableAutoPopulateCustomFieldValues(
          !enableAutoPopulateCustomFieldValues,
        );
        router.invalidate();
      },
    },
    {
      disabled: true,
      key: 'download-data',
      Label: (
        // TODO - FUTURE FEATURE: ADD DOWNLOAD DATA SUPPORT
        <FormatLabelWithIcon Icon={DownloadIcon}>
          <p>Download collection into CSV</p>
          <p>(coming soon)</p>
        </FormatLabelWithIcon>
      ),
    },
    {
      disabled: true,
      key: 'upload-data',
      Label: (
        // TODO - FUTURE FEATURE: ADD UPLOAD DATA SUPPORT
        <FormatLabelWithIcon Icon={UploadIcon}>
          <p>Upload CSV into collection</p>
          <p>(coming soon)</p>
        </FormatLabelWithIcon>
      ),
    },
  ] satisfies MenuItemDef[];

  return {
    items,
  } satisfies TableSettingsMenuPropsDef;
};

const FormatLabelWithStatusIcon = (
  props: PropsWithChildren<{ active?: boolean }>,
) => {
  const { active, children } = props;

  return (
    <FormatLabelWithIcon
      Icon={() => {
        switch (active) {
          case true:
            return <CheckIcon />;

          case false:
            return <CloseIcon />;

          default:
            return null;
        }
      }}
    >
      {children}
    </FormatLabelWithIcon>
  );
};

const FormatLabelWithIcon = (
  props: PropsWithChildren<{ Icon: JSXElementConstructor<{}> }>,
) => {
  const { children, Icon } = props;

  return (
    <div className="grid gap-3 grid-cols-[max-content_1fr] max-w-75">
      <div className="h-full w-6 flex items-center">
        <Icon />
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
};

const IgnoreSortArticlesLabel = () => {
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

const EnableAutoPopulateCustomFieldValuesLabel = () => {
  const { enableAutoPopulateCustomFieldValues } =
    useEnableAutoPopulateCustomFieldValues();
  console.log(
    'AutoPopulateCustomFieldValues enableAutoPopulateCustomFieldValues:',
    enableAutoPopulateCustomFieldValues,
  );

  return (
    <FormatLabelWithStatusIcon active={enableAutoPopulateCustomFieldValues}>
      <p>
        Auto-populate new items with the last entered custom field values for
        this collection.
      </p>
    </FormatLabelWithStatusIcon>
  );
};
