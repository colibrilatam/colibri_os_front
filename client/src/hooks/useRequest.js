'use client';
import { useState } from 'react';

export function useRequest(fn) {
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