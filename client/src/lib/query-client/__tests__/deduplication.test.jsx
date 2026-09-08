import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEvidence } from '@/hooks/queries/useEvidence';
import { createQueryClient } from '@/lib/query-client';
import { evidencesService } from '@/services/evidences';

vi.mock('@/services/evidences', () => ({
  evidencesService: {
    getById: vi.fn(),
  },
}));

function TwoEvidenceDetailViews({ evidenceId }) {
  const { data: evidence1, isLoading: loading1 } = useEvidence(evidenceId);
  const { data: evidence2, isLoading: loading2 } = useEvidence(evidenceId);

  if (loading1 || loading2) return <div>Loading...</div>;

  return (
    <div>
      <span data-testid="evidence-1">{evidence1?.description}</span>
      <span data-testid="evidence-2">{evidence2?.description}</span>
    </div>
  );
}

describe('TanStack Query deduplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fire only one request when two screens consume the same resource', async () => {
    evidencesService.getById.mockResolvedValue({
      id: 'ev-1',
      description: 'Shared evidence',
    });

    const queryClient = createQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <TwoEvidenceDetailViews evidenceId="ev-1" />
      </QueryClientProvider>,
    );

    await waitFor(() =>
      expect(evidencesService.getById).toHaveBeenCalledTimes(1),
    );

    expect(evidencesService.getById).toHaveBeenCalledWith('ev-1');
  });
});
