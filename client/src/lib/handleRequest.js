import { ApiError } from './fetcher';

export async function handleRequest(fn) {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        data: null,
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }
    return { data: null, error: { message: 'Error inesperado', status: 500 } };
  }
}