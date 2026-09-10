'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useDeleteProject(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => projectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
    },
    ...options,
  });
}
