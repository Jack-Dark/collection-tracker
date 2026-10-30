import { useSortable } from '@dnd-kit/react/sortable';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { Button } from '#/components/Button';
import { Image } from '#/components/Image';
import { SimpleErrorBoundary } from '#/components/SimpleErrorBoundary';

import type { SortableThumbnailPropsDef } from './SortableThumbnail.types';

export const SortableThumbnail = (props: SortableThumbnailPropsDef) => {
  const { altText, index, onDelete, src } = props;

  const { handleRef, ref } = useSortable({
    id: src,
    index,
  });

  return (
    <div
      className="border border-theme-divider-3 bg-theme-surface-2 text-theme-t2 grid grid-rows-[auto_1fr] rounded-2xl overflow-hidden"
      key={src}
      ref={ref}
    >
      <SimpleErrorBoundary>
        <div
          className="h-6 flex items-center justify-between gap-1 px-1 bg-theme-surface-2 border-b border-theme-divider-2"
          onClick={onDelete}
        >
          <DragIndicatorIcon
            aria-label="Drag and drop handle"
            className="text-theme-t3 cursor-grab active:cursor-grabbing"
            fontSize="inherit"
            ref={handleRef}
          />
          <Button
            aria-label="Delete"
            className="text-theme-t2 hover:text-theme-t-alert"
            Icon={DeleteIcon}
            size="xs"
            variant="ghost"
          />
        </div>

        <div className="size-18 p-0.5">
          <Image
            alt={altText}
            className="rounded-xl overflow-hidden"
            objectFit="cover"
            src={src}
          />
        </div>
      </SimpleErrorBoundary>
    </div>
  );
};
