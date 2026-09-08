'use client';

import { useMutation } from '@tanstack/react-query';
import { projectsService } from '@/services/project';

export function useRequestUploadSignature(options = {}) {
  return useMutation({
    mutationFn: (data) => projectsService.requestUploadSignature(data),
    ...options,
  });
}
