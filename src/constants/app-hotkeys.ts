import type { Hotkey } from '@tanstack/react-hotkeys';

import { defineAppHotkeys } from '@tanstack/react-hotkeys';

export const hotkeys = {
  new: 'Control+Alt+N',
  removeLast: 'Control+Alt+Backspace',
  save: 'Mod+Enter',
  search: 'Mod+K',
} as const satisfies Record<string, Hotkey>;

export const appHotkeys = defineAppHotkeys({
  'app.new': {
    hotkey: hotkeys.new,
    meta: { group: 'App', name: 'New record' },
    options: {
      conflictBehavior: 'replace',
      ignoreInputs: false,
      preventDefault: true,
      stopPropagation: true,
    },
  },
  'app.remove-last': {
    hotkey: hotkeys.removeLast,
    meta: { group: 'App', name: 'Remove last new record' },
    options: {
      conflictBehavior: 'replace',
      ignoreInputs: false,
      preventDefault: true,
      stopPropagation: true,
    },
  },
  'app.save': {
    hotkey: hotkeys.save,

    meta: { group: 'App', name: 'Save' },
    options: {
      ignoreInputs: false,
      preventDefault: true,
      stopPropagation: true,
    },
  },
  'app.search': {
    hotkey: hotkeys.search,
    meta: { group: 'App', name: 'Search' },
  },
});

declare module '@tanstack/react-hotkeys' {
  interface Register {
    appHotkeys: typeof appHotkeys;
  }
}
