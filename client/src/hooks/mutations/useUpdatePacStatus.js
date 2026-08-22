'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useUpdatePacStatus(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pacId, data }) => projectsService.updatePacStatus(pacId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.projectId),
      });
    },
    ...options,
  });
}
