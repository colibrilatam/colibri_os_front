'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useProjectMembers(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.projects.members(projectId),
    queryFn: () => projectsService.getProjectMembers(projectId),
    enabled: Boolean(projectId),
    ...options,
  });
}
