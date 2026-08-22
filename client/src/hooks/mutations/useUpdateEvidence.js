'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

export function useUpdateEvidence(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evidenceId, data }) =>
      evidencesService.update(evidenceId, data),
    onSuccess: (_data, variables) => {
      const { evidenceId, data } = variables;
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.detail(evidenceId),
      });
      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.evidences.byProject(data.projectId),
        });
      }
    },
    ...options,
  });
}
