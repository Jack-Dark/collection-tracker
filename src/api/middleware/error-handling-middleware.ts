import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { isAPIError } from 'better-auth/api';
import { ReasonPhrases } from 'http-status-codes';

export const errorHandlingMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  try {
    // Executes downstream middleware and the server function itself
    return await next();
  } catch (error) {
    console.error('Error captured by middleware:', error);

    if (error instanceof Error && error.message === ReasonPhrases.NOT_FOUND) {
      throw redirect({ to: '/404' });
    }

    if (error instanceof Error || isAPIError(error)) {
      throw new Error(error.message);
    }

    throw error;
  }
});
