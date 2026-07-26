import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient, { setLogoutCallback } from '../client.js';
import { ApiError } from '../errors.js';
import { ERROR_CODES } from '../types.js';

vi.mock('../token.js', () => ({
  getToken: vi.fn(() => null),
  clearToken: vi.fn(),
  setToken: vi.fn(),
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setLogoutCallback(null);
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const response = await apiClient.get('/test/success');
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ data: 'ok' });
    });

    it('should include x-request-id header', async () => {
      const response = await apiClient.get('/test/success');
      expect(response.config.headers['x-request-id']).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should throw ApiError on 401', async () => {
      try {
        await apiClient.get('/test/unauthorized');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
        expect(error.status).toBe(401);
        expect(error.isNetworkError).toBe(false);
      }
    });

    it('should throw ApiError on 404', async () => {
      try {
        await apiClient.get('/test/not-found');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.NOT_FOUND);
        expect(error.status).toBe(404);
      }
    });

    it('should throw ApiError on 422 validation error', async () => {
      try {
        await apiClient.get('/test/validation');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
        expect(error.status).toBe(422);
        expect(Array.isArray(error.details)).toBe(true);
        expect(error.details).toHaveLength(2);
      }
    });

    it('should throw ApiError on 500', async () => {
      try {
        await apiClient.get('/test/server-error');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
        expect(error.status).toBe(500);
      }
    });
  });

  describe('Timeout handling', () => {
    it('should have timeout configured', () => {
      expect(apiClient.defaults.timeout).toBe(30000);
    });

    it('should allow custom timeout per request', async () => {
      const response = await apiClient.get('/test/success', { timeout: 5000 });
      expect(response.config.timeout).toBe(5000);
    });
  });

  describe('Cancellation', () => {
    it('should cancel request with AbortController', async () => {
      const controller = new AbortController();
      const promise = apiClient.get('/test/slow', { signal: controller.signal });
      controller.abort();

      try {
        await promise;
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
        expect(error.message).toBe('Request cancelada');
      }
    });
  });

  describe('Request ID', () => {
    it('should generate unique request IDs', async () => {
      const response1 = await apiClient.get('/test/success');
      const response2 = await apiClient.get('/test/success');

      const id1 = response1.config.headers['x-request-id'];
      const id2 = response2.config.headers['x-request-id'];

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });
  });
});
