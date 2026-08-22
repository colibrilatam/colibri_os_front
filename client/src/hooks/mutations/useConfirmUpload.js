'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useConfirmUpload(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => projectsService.confirmUpload(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.detail(variables.evidenceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.versions(variables.evidenceId),
      });
    },
    ...options,
  });
}
