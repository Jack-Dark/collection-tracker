import type { JSXElementConstructor, HTMLAttributes } from 'react';
import type { TValueRecordDef } from '../../ComboboxField.types';

export type SortableChipPropsDef<TValue extends TValueRecordDef> = {
  enableChipSort: boolean | undefined;
  id: string;
  index: number;
  item: TValue;
  label: string;
  onRemoveChip: ((item: TValue, index: number) => void) | undefined;
  RenderChip: JSXElementConstructor<
    HTMLAttributes<HTMLElement> & {
      item: TValue;
    }
  >;
};
