'use client';

import { useQuery } from '@tanstack/react-query';
import { evaluationsService } from '@/services/evaluations';
import { queryKeys } from '@/lib/query-keys';

export function usePendingReviews(options = {}) {
  return useQuery({
    queryKey: queryKeys.evaluations.pending,
    queryFn: () => evaluationsService.getPendingReviews(),
    ...options,
  });
}
