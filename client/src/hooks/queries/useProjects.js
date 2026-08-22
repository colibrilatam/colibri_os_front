'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useProjects(options = {}) {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: () => projectsService.getAll(),
    ...options,
  });
}
