import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';
import { useLayoutEffect, useRef, useState } from 'react';

import { LoadingSpinner } from './components/LoadingSpinner';
import { useSpinner } from './useSpinner';

export const FullPageLoadingSpinner = () => {
  const { hideSpinner, isSpinning } = useSpinner();

  const [showForceClose, setShowForceClose] = useState<boolean>(false);

  const debouncedShowForceClose = useRef(
    // ref required to correctly cancel debounce called via state changes https://stackoverflow.com/a/74738879
    _.debounce(() => {
      setShowForceClose(true);
    }, 5000),
  ).current;

  useLayoutEffect(() => {
    if (isSpinning && !showForceClose) {
      debouncedShowForceClose();
    } else if (!isSpinning) {
      if (showForceClose) {
        setShowForceClose(false);
      } else {
        debouncedShowForceClose.cancel();
      }
    }
  }, [isSpinning]);

  return isSpinning ? (
    <div
      className="fixed z-99999 size-full flex items-center justify-center bg-[rgba(0,0,0,0.2)]"
      data-loading-overlay=""
    >
      {showForceClose && (
        <button
          className="absolute top-10 right-10 p-1 bg-[rgba(0,0,0,0.2)] rounded-full cursor-pointer"
          onClick={hideSpinner}
        >
          <CloseIcon className="text-white" fontSize="large" />
        </button>
      )}

      <LoadingSpinner
        className="size-20 border-2"
        enableShadow
        variant="color"
      />
    </div>
  ) : null;
};
