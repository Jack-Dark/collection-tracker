import type { PropsWithChildren } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { FormatLabelWithIcon } from '../FormatLabelWithIcon';

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
