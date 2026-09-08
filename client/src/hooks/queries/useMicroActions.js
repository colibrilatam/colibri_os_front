'use client';

import { useQuery } from '@tanstack/react-query';
import { microActionService } from '@/services/micro-action';
import { queryKeys } from '@/lib/query-keys';

export function useMicroActions(params = {}, options = {}) {
  return useQuery({
    queryKey: [...queryKeys.microActions.all, params],
    queryFn: () => microActionService.getAll(params),
    ...options,
  });
}
