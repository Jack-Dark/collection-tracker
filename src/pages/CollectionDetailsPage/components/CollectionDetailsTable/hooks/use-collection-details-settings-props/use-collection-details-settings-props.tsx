import type { PropsWithChildren } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';

import type { MenuItemDef } from '#/components/MoreMenu/MoreMenu.types';
import type { TableSettingsMenuPropsDef } from '#/components/Table/components/TableSettingsMenu/TableSettingsMenu.types';

import { EnableAutoPopulateCustomFieldValuesLabel } from './components/EnableAutoPopulateCustomFieldValuesLabel';
import { FormatLabelWithIcon } from './components/FormatLabelWithIcon';
import { IgnoreSortArticlesLabel } from './components/IgnoreSortArticlesLabel';
import { useEnableAutoPopulateCustomFieldValues } from './hooks/use-enable-auto-populate-custom-field-values';
import { useIgnoreSortArticles } from './hooks/use-ignore-sort-articles';

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

export const FormatLabelWithStatusIcon = (
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
