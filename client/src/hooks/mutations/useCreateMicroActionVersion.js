'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { microActionService } from '@/services/micro-action';
import { queryKeys } from '@/lib/query-keys';

export function useCreateMicroActionVersion(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ instanceId, file, executionNotes }) =>
      microActionService.createVersion(instanceId, { file, executionNotes }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.microActions.detail(variables.instanceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.microActions.all,
      });
    },
    ...options,
  });
}
