'use client';

import { useQuery } from '@tanstack/react-query';
import { evaluationsService } from '@/services/evaluations';
import { queryKeys } from '@/lib/query-keys';

export function useEvaluations(params = {}, options = {}) {
  return useQuery({
    queryKey: [...queryKeys.evaluations.all, params],
    queryFn: () => evaluationsService.getEvaluations(params),
    ...options,
  });
}
