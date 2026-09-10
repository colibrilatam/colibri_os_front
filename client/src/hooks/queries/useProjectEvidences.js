'use client';

import { useQuery } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

export function useProjectEvidences(projectId, options = {}) {
  return useQuery({
    queryKey: queryKeys.evidences.byProject(projectId),
    queryFn: () => evidencesService.getProjectEvidences(projectId),
    enabled: Boolean(projectId),
    ...options,
  });
}
