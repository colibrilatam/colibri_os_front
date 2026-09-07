'use client';

import { useQuery } from '@tanstack/react-query';
import { evaluationsService } from '@/services/evaluations';
import { queryKeys } from '@/lib/query-keys';

export function useEvidenceEvaluations(evidenceId, options = {}) {
  return useQuery({
    queryKey: queryKeys.evaluations.byEvidence(evidenceId),
    queryFn: () => evaluationsService.getByEvidence(evidenceId),
    enabled: Boolean(evidenceId),
    ...options,
  });
}
