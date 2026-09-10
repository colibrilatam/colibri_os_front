'use client';

import { useQuery } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

/**
 * Obtiene el detalle de una evidencia.
 * La query se habilita solo cuando evidenceId está definido.
 */
export function useEvidence(evidenceId, options = {}) {
  return useQuery({
    queryKey: queryKeys.evidences.detail(evidenceId),
    queryFn: () => evidencesService.getById(evidenceId),
    enabled: Boolean(evidenceId),
    ...options,
  });
}
