'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useTramos(options = {}) {
  return useQuery({
    queryKey: queryKeys.tramos.all,
    queryFn: () => projectsService.getAllTramos(),
    ...options,
  });
}
