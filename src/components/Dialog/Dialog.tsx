import type { JSXElementConstructor, PropsWithChildren } from 'react';

import { Dialog as MuiDialog } from '@base-ui/react/dialog';
import CloseIcon from '@mui/icons-material/Close';
import { twMerge } from 'tailwind-merge';

export type DialogPropsDef = PropsWithChildren<
  {
    /** Applies to the Popup wrapper. */
    className?: string;
    disableOnClose?: boolean;
    Footer?: JSXElementConstructor<{}>;
    Header?: JSXElementConstructor<{}> | string;
    isFullScreen?: boolean;
  } & (
    | {
        hideClose: boolean;
        onClose?: never;
      }
    | {
        hideClose?: never;
        onClose: () => void;
      }
  )
>;

export const Dialog = (props: DialogPropsDef) => {
  const {
    children,
    className,
    disableOnClose,
    Footer,
    Header,
    hideClose,
    isFullScreen,
    onClose,
  } = props;

  return (
    <MuiDialog.Root disablePointerDismissal={hideClose} modal open>
      <MuiDialog.Viewport
        className={`fixed inset-0 flex md:items-center md:justify-center overflow-hidden ${isFullScreen ? '' : 'md:p-6'}`}
      >
        <MuiDialog.Popup
          className={twMerge(
            `relative grid auto-rows-[max-content_1fr_max-content] w-full max-w-full h-full md:min-h-70 max-h-full`,
            isFullScreen
              ? ''
              : `md:w-full md:max-w-100 md:h-auto md:max-h-[90dvh]`,
            `flex-col bg-theme-surface-1 dark:bg-theme-surface-2 text-theme-t1 duration-100 ease-out md:rounded-3xl`,
            className,
          )}
          data-dialog=""
        >
          {(Header || !hideClose) && (
            <div
              className={`flex ${Header && hideClose ? 'justify-center' : Header ? 'justify-between' : 'justify-end'} items-center gap-2 px-4 py-2 border-b border-theme-divider-2`}
            >
              {!hideClose && <CloseIcon className="opacity-0" />}

              {Header &&
                (typeof Header === 'string' ? (
                  <MuiDialog.Title className="text-center">
                    {Header}
                  </MuiDialog.Title>
                ) : (
                  <Header />
                ))}

              {!hideClose && (
                <MuiDialog.Close
                  className="cursor-pointer hover:text-theme-t-alert p-2"
                  disabled={disableOnClose}
                  onClick={onClose}
                >
                  <CloseIcon />
                </MuiDialog.Close>
              )}
            </div>
          )}

          <div className="overflow-y-auto py-6 px-4 md:content-center">
            {children}
          </div>

          {Footer && (
            <div className="grid grid-flow-col gap-2 p-2 border-t border-theme-divider-2">
              <Footer />
            </div>
          )}
        </MuiDialog.Popup>
      </MuiDialog.Viewport>
    </MuiDialog.Root>
  );
};
