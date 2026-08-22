'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { queryKeys } from '@/lib/query-keys';

export function useCreateProject(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => projectsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all,
      });
    },
    ...options,
  });
}
