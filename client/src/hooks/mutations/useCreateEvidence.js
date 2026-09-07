'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

export function useCreateEvidence(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => evidencesService.createEvidence(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.byProject(variables.projectId),
      });
    },
    ...options,
  });
}
