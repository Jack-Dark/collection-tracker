import { createMiddleware } from '@tanstack/react-start';
import { isAPIError } from 'better-auth/api';

export const errorHandlingMiddleware = createMiddleware({
  type: 'function',
}).server(async ({ next }) => {
  try {
    // Executes downstream middleware and the server function itself
    return await next();
  } catch (error) {
    console.error('Error captured by middleware:', error);

    if (error instanceof Error || isAPIError(error)) {
      throw new Error(error.message);
    }

    throw error;
  }
});
