import type { ErrorComponentProps } from '@tanstack/react-router';

import {
  ErrorComponent,
  Link,
  useLocation,
  useRouter,
} from '@tanstack/react-router';
import { useEffect } from 'react';

import { Button } from '../Button';

export function RouteCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useLocation({
    select: (location) => {
      return location.pathname === '/';
    },
  });

  useEffect(() => {
    console.error(error);
  }, [error]);

  // ? Detect Vite / Nitro chunk load failures
  if (
    error instanceof Error &&
    (error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('error loading dynamically imported module'))
  ) {
    // ? Force a hard reload to get the new Netlify production assets
    if (typeof window !== 'undefined') {
      window.location.reload();
    }

    return null;
  }

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <Button
          onClick={() => {
            router.invalidate();
          }}
          text="Try Again"
          variant="secondary"
        />
        {isRoot ? (
          <Link to="/">
            <Button text="Home" />
          </Link>
        ) : (
          <Link
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            to="/"
          >
            <Button text="Go Back" />
          </Link>
        )}
      </div>
    </div>
  );
}
