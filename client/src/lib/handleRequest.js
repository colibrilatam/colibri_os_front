import { ApiError } from '@/lib/api/errors';

/**
 * @deprecated Use TanStack Query hooks instead.
 */
export async function handleRequest(fn) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('handleRequest is deprecated. Use TanStack Query hooks instead.');
  }
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        data: null,
        error: error
      };
    }
    return { data: null, error: { message: 'Error inesperado', status: 500 } };
  }
}
