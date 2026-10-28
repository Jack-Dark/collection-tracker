import { createStore, useSelector } from '@tanstack/react-store';
import { useLayoutEffect, useState } from 'react';

const spinnerStore = createStore({ isSpinning: false });

export const useSpinner = () => {
  const { isSpinning } = useSelector(spinnerStore);

  const hideSpinner = () => {
    return spinnerStore.setState(() => {
      return { isSpinning: false };
    });
  };

  const showSpinner = () => {
    return spinnerStore.setState(() => {
      return { isSpinning: true };
    });
  };

  const toggleSpinner = (show?: boolean) => {
    if (show !== undefined) {
      spinnerStore.setState(() => {
        return { isSpinning: show };
      });
    } else
      spinnerStore.setState((prevValue) => {
        return { isSpinning: !prevValue };
      });
  };

  const [processing, setProcessing] = useState<boolean>(false);

  /**
   * Handles showing/hiding the full-page loading indicator.
   *
   * Usage example:
   * ```
   * const { onInterceptRequest } = useSpinner();
   *
   * const handleEndpoint = async () => {
   *   await onInterceptRequest(async () => {
   *     try {
   *        await yourRequestedAxiosEndpoint();
   *      } catch (error: unknown) {
   *        // ...
   *      }
   *   })
   * };
   * ```
   */
  const onInterceptRequest = async (requestCallback: () => Promise<any>) => {
    try {
      showSpinner();

      return requestCallback();
    } finally {
      hideSpinner();
    }
  };

  /**
   * Handles toggling the processing state for use elsewhere.
   *
   * Usage example:
   * ```
   * const { onInterceptProcessingRequest, processing } = useSpinner();
   *
   * const handleEndpoint = async () => {
   *   await onInterceptProcessingRequest(async () => {
   *     try {
   *        await yourRequestedAxiosEndpoint();
   *      } catch (error: unknown) {
   *        // ...
   *      }
   *   })
   * };
   *
   * return <Button processing={processing} text="Confirm" />
   * ```
   */
  const onInterceptProcessingRequest = async (
    requestCallback: () => Promise<any>,
  ) => {
    try {
      setProcessing(true);

      return requestCallback();
    } finally {
      setProcessing(false);
    }
  };

  return {
    hideSpinner,
    isSpinning,
    onInterceptProcessingRequest,
    onInterceptRequest,
    processing,
    showSpinner,
    toggleSpinner,
  };
};

export const useShowSpinner = (isLoading: boolean) => {
  const { hideSpinner, isSpinning, showSpinner } = useSpinner();

  useLayoutEffect(() => {
    if (isLoading && !isSpinning) {
      showSpinner();
    } else if (!isLoading && isSpinning) {
      hideSpinner();
    }
  }, [isLoading]);
};
