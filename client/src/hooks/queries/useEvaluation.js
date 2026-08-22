'use client';

import { useQuery } from '@tanstack/react-query';
import { evaluationsService } from '@/services/evaluations';
import { queryKeys } from '@/lib/query-keys';

export function useEvaluation(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.evaluations.byId(id),
    queryFn: () => evaluationsService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}
