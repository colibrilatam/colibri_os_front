'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

export function useSubmitEvidence(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (evidenceId) => evidencesService.submit(evidenceId),
    onSuccess: (_data, evidenceId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.detail(evidenceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.evidences.all,
      });
    },
    ...options,
  });
}
