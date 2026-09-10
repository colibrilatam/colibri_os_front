'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useProjectMicroActions(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.projects.microActions(projectId),
    queryFn: () => projectsService.microActionInstance(projectId),
    enabled: Boolean(projectId),
    ...options,
  });
}
