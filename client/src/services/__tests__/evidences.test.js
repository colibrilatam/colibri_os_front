import { describe, it, expect, vi, beforeEach } from 'vitest';
import { evidencesService } from '../evidences.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

vi.mock('@/lib/api', () => {
  const mockClient = {
    post: vi.fn(),
    get: vi.fn(),
  };
  return {
    apiClient: mockClient,
    default: mockClient,
  };
});

describe('evidencesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEvidence', () => {
    it('should create evidence and return data', async () => {
      const mockEvidenceData = {
        projectId: 1,
        title: 'Test Evidence',
        description: 'Description',
        fileUrl: 'https://example.com/file.pdf',
      };

      const mockResponse = {
        data: {
          id: 1,
          ...mockEvidenceData,
          status: 'pending',
        },
      };

      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await evidencesService.createEvidence(mockEvidenceData);

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/evidence', mockEvidenceData);
    });

    it('should throw ApiError on error', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Título requerido',
          status: 422,
          details: { field: 'title' },
        })
      );

      try {
        await evidencesService.createEvidence({});
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      }
    });
  });

  describe('submit', () => {
    it('should submit evidence', async () => {
      const mockResponse = {
        data: { id: 1, status: 'submitted' },
      };

      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await evidencesService.submit(1);

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/evidence/1/submit');
    });
  });

  describe('createEvaluation', () => {
    it('should create evaluation', async () => {
      const mockEvalData = {
        evidenceId: 1,
        rubricId: 1,
        score: 85,
      };

      const mockResponse = {
        data: { id: 1, ...mockEvalData, status: 'completed' },
      };

      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await evidencesService.createEvaluation(mockEvalData);

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/evaluations', mockEvalData);
    });
  });

  describe('getActiveRubrics', () => {
    it('should return active rubrics', async () => {
      const mockRubrics = [
        { id: 1, name: 'Rubric 1', version: '1.0' },
        { id: 2, name: 'Rubric 2', version: '1.0' },
      ];

      const mockResponse = { data: mockRubrics };

      const { apiClient } = await import('@/lib/api');
      apiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await evidencesService.getActiveRubrics();

      expect(result).toEqual(mockRubrics);
      expect(apiClient.get).toHaveBeenCalledWith('/evaluations/rubrics/active');
    });
  });

  describe('closeEvaluation', () => {
    it('should close evaluation', async () => {
      const mockData = {
        evaluationId: 1,
        finalScore: 90,
      };

      const mockResponse = {
        data: { id: 1, status: 'closed' },
      };

      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await evidencesService.closeEvaluation(mockData);

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/evaluations/finalize', mockData);
    });
  });
});
