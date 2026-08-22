'use client';

import { useQuery } from '@tanstack/react-query';
import { evaluationsService } from '@/services/evaluations';
import { queryKeys } from '@/lib/query-keys';

export function useActiveRubrics(options = {}) {
  return useQuery({
    queryKey: queryKeys.evaluations.rubrics.active,
    queryFn: () => evaluationsService.getActiveRubrics(),
    ...options,
  });
}
