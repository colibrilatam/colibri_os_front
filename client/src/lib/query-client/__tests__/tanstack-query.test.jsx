import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEvidence } from '@/hooks/queries/useEvidence';
import { useUpdateEvidence } from '@/hooks/mutations/useUpdateEvidence';
import { createQueryClient } from '@/lib/query-client';
import { evidencesService } from '@/services/evidences';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

vi.mock('@/services/evidences', () => ({
  evidencesService: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = createQueryClient();
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('TanStack Query integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should not retry on 4xx errors', async () => {
    evidencesService.getById.mockRejectedValueOnce(
      new ApiError({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Bad request',
        status: 400,
      }),
    );

    const { result } = renderHook(() => useEvidence('ev-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(evidencesService.getById).toHaveBeenCalledTimes(1);
    expect(result.current.error.status).toBe(400);
  });

  it('should retry on network errors and then fail', async () => {
    evidencesService.getById
      .mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.NETWORK_ERROR,
          message: 'Network error',
          isNetworkError: true,
        }),
      )
      .mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.NETWORK_ERROR,
          message: 'Network error',
          isNetworkError: true,
        }),
      )
      .mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.NETWORK_ERROR,
          message: 'Network error',
          isNetworkError: true,
        }),
      );

    const { result } = renderHook(() => useEvidence('ev-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 10000,
    });

    // Initial + 2 retries
    expect(evidencesService.getById).toHaveBeenCalledTimes(3);
  });

  it('should invalidate evidence detail after update mutation', async () => {
    const updatedEvidence = { id: 'ev-1', description: 'Updated' };

    evidencesService.getById
      .mockResolvedValueOnce({ id: 'ev-1', description: 'Original' })
      .mockResolvedValueOnce(updatedEvidence);

    evidencesService.update.mockResolvedValueOnce(updatedEvidence);

    const queryClient = createQueryClient();
    const wrapper = function Wrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
    };

    const { result: queryResult } = renderHook(() => useEvidence('ev-1'), {
      wrapper,
    });

    await waitFor(
      () =>
        expect(queryResult.current.data).toEqual({
          id: 'ev-1',
          description: 'Original',
        }),
      { timeout: 5000 },
    );

    const { result: mutationResult } = renderHook(() => useUpdateEvidence(), {
      wrapper,
    });

    mutationResult.current.mutate({
      evidenceId: 'ev-1',
      data: { description: 'Updated', projectId: 'proj-1' },
    });

    await waitFor(() =>
      expect(queryResult.current.data).toEqual(updatedEvidence),
      { timeout: 10000 },
    );

    expect(evidencesService.update).toHaveBeenCalledWith('ev-1', {
      description: 'Updated',
      projectId: 'proj-1',
    });
    expect(evidencesService.getById).toHaveBeenCalledTimes(2);
  });
});
