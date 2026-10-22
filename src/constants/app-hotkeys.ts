import type { Hotkey } from '@tanstack/react-hotkeys';

import { defineAppHotkeys } from '@tanstack/react-hotkeys';

export const hotkeys = {
  new: 'Control+Alt+N',
  submit: 'Mod+Enter',
} as const satisfies Record<string, Hotkey>;

export const appHotkeys = defineAppHotkeys({
  'app.new': {
    hotkey: 'Control+Alt+N',
    meta: { group: 'App', name: 'New record' },
    options: {
      ignoreInputs: false,
      preventDefault: true,
      stopPropagation: true,
    },
  },
  'app.remove-last': {
    hotkey: 'Control+Alt+Backspace',
    meta: { group: 'App', name: 'Remove last new record' },
    options: {
      ignoreInputs: false,
      preventDefault: true,
      stopPropagation: true,
    },
  },
  'app.save': {
    hotkey: 'Mod+Enter',

    meta: { group: 'App', name: 'Save' },
    options: {
      ignoreInputs: false,
      preventDefault: true,
      stopPropagation: true,
    },
  },
  'app.search': {
    hotkey: 'Mod+K',
    meta: { group: 'App', name: 'Search' },
  },
});

declare module '@tanstack/react-hotkeys' {
  interface Register {
    appHotkeys: typeof appHotkeys;
  }
}
