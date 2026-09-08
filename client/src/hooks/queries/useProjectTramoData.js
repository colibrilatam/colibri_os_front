'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useProjectTramoData(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.projects.tramoData(projectId),
    queryFn: () => projectsService.projectTramoData(projectId),
    enabled: Boolean(projectId),
    ...options,
  });
}
