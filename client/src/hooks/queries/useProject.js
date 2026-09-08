'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

/**
 * Obtiene el detalle de un proyecto.
 */
export function useProject(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => projectsService.getById(projectId),
    enabled: Boolean(projectId),
    ...options,
  });
}
