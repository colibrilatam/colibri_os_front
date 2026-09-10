'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useUpdateProject(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => projectsService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
    },
    ...options,
  });
}
