'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useProjectNft(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.projects.nft(projectId),
    queryFn: () => projectsService.nft(projectId),
    enabled: Boolean(projectId),
    ...options,
  });
}
