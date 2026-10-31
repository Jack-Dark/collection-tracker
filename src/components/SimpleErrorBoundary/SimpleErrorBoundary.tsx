import type { PropsWithChildren } from 'react';
import type { ErrorBoundaryPropsWithFallback } from 'react-error-boundary';

import { ErrorBoundary } from 'react-error-boundary';

import { githubUrl } from '../../constants/githubUrl';

export const SimpleErrorBoundary = ({
  children,
  ...rest
}: PropsWithChildren<Partial<ErrorBoundaryPropsWithFallback>>) => {
  return (
    <ErrorBoundary fallback={<SimpleErrorBoundaryContent />} {...rest}>
      {children}
    </ErrorBoundary>
  );
};

export const SimpleErrorBoundaryContent = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="p-4 bg-white text-black rounded-full">
        <p>Something went wrong.</p>
        <p>
          <a href={githubUrl.issues} target="_blank">
            Please report this bug.
          </a>
        </p>
      </div>
    </div>
  );
};
