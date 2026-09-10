'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

export function useDeleteEvidence(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evidenceId, projectId }) =>
      evidencesService.delete(evidenceId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.detail(variables.evidenceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.byProject(variables.projectId),
      });
    },
    ...options,
  });
}
