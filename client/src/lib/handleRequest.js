import { ApiError } from './fetcher';

export async function handleRequest(fn) {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      //console.log(error);
      return {
        data: null,
        error: error
      };
    }
    return { data: null, error: { message: 'Error inesperado', status: 500 } };
  }
}