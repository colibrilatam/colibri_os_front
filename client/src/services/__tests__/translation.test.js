import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translationService } from '../translation.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

describe('translationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('translate', () => {
    it('should return translated text', async () => {
      const mockResponse = { translation: 'Hola mundo' };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await translationService.translate('Hello world');
      expect(result).toBe('Hola mundo');
    });

    it('should throw ApiError on error response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Translation failed' }),
      });

      try {
        await translationService.translate('Hello');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
        expect(error.status).toBe(500);
      }
    });

    it('should throw ApiError on network error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      try {
        await translationService.translate('Hello');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
        expect(error.isNetworkError).toBe(true);
      }
    });

    it('should include x-request-id header', async () => {
      const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ translation: 'test' }),
      });

      await translationService.translate('test');
      
      expect(mockFetch).toHaveBeenCalledWith('/api/translate', expect.objectContaining({
        headers: expect.objectContaining({
          'x-request-id': expect.any(String),
        }),
      }));
    });
  });
});
