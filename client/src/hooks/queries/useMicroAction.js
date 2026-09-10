'use client';

import { useQuery } from '@tanstack/react-query';
import { microActionService } from '@/services/micro-action';
import { queryKeys } from '@/lib/query-keys';

export function useMicroAction(id, options = {}) {
  return useQuery({
    queryKey: queryKeys.microActions.detail(id),
    queryFn: () => microActionService.getById(id),
    enabled: Boolean(id),
    ...options,
  });
}
