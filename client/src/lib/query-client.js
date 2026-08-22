import { QueryClient, isServer } from '@tanstack/react-query';
import { ApiError } from './api/errors.js';

/**
 * Determina si un error debe ser reintentado por TanStack Query.
 * No reintenta errores del cliente (4xx) ni de autenticación.
 * Reintenta errores de red, timeout y errores de servidor (5xx) hasta 2 veces.
 */
function shouldRetry(failureCount, error) {
  if (error instanceof ApiError) {
    // Errores no recuperables del cliente
    if (error.status !== null && error.status >= 400 && error.status < 500) {
      return false;
    }
  }

  return failureCount < 2;
}

export const queryClientDefaultOptions = {
  queries: {
    retry: shouldRetry,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  },
  mutations: {
    retry: false,
  },
};

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: queryClientDefaultOptions,
  });
}

let browserQueryClient;

/**
 * Devuelve un QueryClient único por request.
 * En el navegador reutiliza la misma instancia para preservar la caché.
 * En servidor crea una instancia nueva en cada request.
 */
export function getQueryClient() {
  if (isServer) {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}
