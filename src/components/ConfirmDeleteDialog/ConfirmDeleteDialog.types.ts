import type { AnyReactFormApi } from '@tanstack/react-form';
import type { PropsWithChildren } from 'react';

import type { DialogPropsDef } from '../Dialog';

export type ConfirmDeleteDialogPropsDef = PropsWithChildren<{
  Header?: DialogPropsDef['Header'];
  hideDialog: () => void;
  submitText?: string;
}> &
  (
    | {
        form?: never;
        onConfirm: () => Promise<void>;
      }
    | {
        form: AnyReactFormApi;
        onConfirm?: never;
      }
  );
