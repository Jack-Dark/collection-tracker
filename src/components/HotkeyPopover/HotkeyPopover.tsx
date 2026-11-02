import type { PropsWithChildren } from 'react';

import { formatForDisplay } from '@tanstack/react-hotkeys';

import { Popover } from '#/components/Popover';
import { hotkeys } from '#/constants/app-hotkeys';

import type { PopoverPropsDef } from '../Popover/Popover.types';

export const HotkeyPopover = ({
  children,
  hotkey,
  ...rest
}: PropsWithChildren<
  { hotkey: keyof typeof hotkeys } & Omit<
    PopoverPropsDef,
    'Description' | 'Trigger'
  >
>) => {
  const formattedSaveHotkey = formatForDisplay(hotkeys[hotkey]);

  return (
    <Popover
      Description={`Hotkey: ${formattedSaveHotkey}`}
      isTriggerButton
      Trigger={children}
      {...rest}
    />
  );
};
