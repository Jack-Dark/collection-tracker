import type { Hotkey } from '@tanstack/react-hotkeys';

export const hotkeys = {
  new: 'Control+Alt+N',
  submit: 'Mod+Enter',
} as const satisfies Record<string, Hotkey>;
