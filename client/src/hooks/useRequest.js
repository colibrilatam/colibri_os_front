'use client';
import { useState } from 'react';

/**
 * @deprecated Use TanStack Query hooks instead.
 */
export function useRequest(fn) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('useRequest is deprecated. Use TanStack Query hooks instead.');
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function execute(...args) {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      return { data: result, error: null };
    } catch (err) {
      const errorMsg = err.message || 'Error inesperado';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading, error };
}