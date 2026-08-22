'use client';

import { useQuery } from '@tanstack/react-query';
import { evidencesService } from '@/services/evidences';
import { queryKeys } from '@/lib/query-keys';

/**
 * Obtiene el historial de versiones de una evidencia.
 */
export function useEvidenceVersions(evidenceId, options = {}) {
  return useQuery({
    queryKey: queryKeys.evidences.versions(evidenceId),
    queryFn: () => evidencesService.getVersions(evidenceId),
    enabled: Boolean(evidenceId),
    ...options,
  });
}
