'use client';

import { useQuery } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

export function useMicroActionEvidences(instanceId, options = {}) {
  return useQuery({
    queryKey: queryKeys.evidences.byMicroAction(instanceId),
    queryFn: () => evidencesService.getMicroActionInstanceEvidences(instanceId),
    enabled: Boolean(instanceId),
    ...options,
  });
}
