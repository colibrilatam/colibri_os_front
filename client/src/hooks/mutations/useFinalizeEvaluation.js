'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { evaluationsService } from '@/services/evaluations';
import { queryKeys } from '@/lib/query-keys';

export function useFinalizeEvaluation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => evaluationsService.finalize(data),
    onSuccess: (_data, variables) => {
      if (variables.evidenceId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.evidences.detail(variables.evidenceId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.evaluations.byEvidence(variables.evidenceId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.evaluations.pending,
      });
    },
    ...options,
  });
}
