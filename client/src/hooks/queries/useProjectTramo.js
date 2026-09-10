'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useProjectTramo(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.projects.tramo(projectId),
    queryFn: () => projectsService.currentTramo(projectId),
    enabled: Boolean(projectId),
    ...options,
  });
}
