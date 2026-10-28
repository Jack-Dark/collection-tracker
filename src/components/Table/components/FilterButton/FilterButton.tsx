import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';

import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';

import type { FiltersButtonPropsDef } from './FilterButton.types';

export const FilterButton = (props: FiltersButtonPropsDef) => {
  const { FiltersContent, numApplied, onCancel, onReset, onSubmit } = props;

  const [showFilters, hideFilters] = useDialog(() => {
    return (
      <Dialog
        Footer={() => {
          return (
            <>
              <Button
                onClick={async () => {
                  await onReset();
                  hideFilters();
                }}
                text="Reset Filters"
                variant="mono"
              />
              <Button
                Icon={SearchIcon}
                onClick={async () => {
                  await onSubmit();
                  hideFilters();
                }}
                text="View Results"
              />
            </>
          );
        }}
        Header="Filters"
        onClose={async () => {
          await onCancel();
          hideFilters();
        }}
      >
        <FiltersContent />
      </Dialog>
    );
  }, []);

  return (
    <Button
      aria-label={`Filters (${numApplied})`}
      className="btn-xs md:btn-md"
      Icon={() => {
        return (
          <div>
            {numApplied ? <FilterAltIcon /> : <FilterAltOutlinedIcon />}
          </div>
        );
      }}
      onClick={showFilters}
      variant={numApplied ? 'secondary' : 'mono'}
    >
      <span className="hidden md:inline">
        Filters{numApplied ? ` (${numApplied})` : ''}
      </span>
    </Button>
  );
};
