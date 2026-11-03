import { Combobox } from '@base-ui/react';
import { useSortable } from '@dnd-kit/react/sortable';
import ClearIcon from '@mui/icons-material/Clear';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import type { TValueRecordDef } from '../../ComboboxField.types';
import type { SortableChipPropsDef } from './SortableChip.types';

export const SortableChip = <TValue extends TValueRecordDef>(
  props: SortableChipPropsDef<TValue>,
) => {
  const { enableChipSort, id, index, item, label, onRemoveChip, RenderChip } =
    props;

  const { ref } = useSortable({ disabled: !enableChipSort, id, index });

  return (
    <Combobox.Chip
      aria-label={label}
      className="bg-theme-surface-1 dark:bg-theme-surface-3 flex items-center gap-1 border border-theme-divider-2 rounded-full px-2 py-.5"
      ref={ref}
    >
      {enableChipSort && (
        <DragIndicatorIcon
          className="text-theme-t3 cursor-grab active:cursor-grabbing"
          fontSize="inherit"
        />
      )}
      <RenderChip item={item} />
      <Combobox.ChipRemove
        aria-label={`Remove ${label}`}
        className="text-theme-t2 hover:text-theme-t-alert-hover cursor-pointer ml-auto p-0.5 leading-0"
        onClick={() => {
          onRemoveChip?.(item, index);
        }}
      >
        <ClearIcon fontSize="inherit" />
      </Combobox.ChipRemove>
    </Combobox.Chip>
  );
};
