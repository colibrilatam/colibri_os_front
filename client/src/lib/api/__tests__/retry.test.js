import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../client.js';
import { ApiError } from '../errors.js';
import { ERROR_CODES } from '../types.js';
import { resetRetryCounter } from './mocks/server.js';

vi.mock('../token.js', () => ({
  getToken: vi.fn(() => null),
  clearToken: vi.fn(),
  setToken: vi.fn(),
}));

describe('apiClient retry behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRetryCounter();
  });

  it('should NOT retry network errors at the HTTP client level', async () => {
    try {
      await apiClient.get('/test/retry-always-fails');
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      // El retry ahora lo gestiona TanStack Query, no el cliente HTTP
    }
  });

  it('should NOT retry on 4xx errors', async () => {
    try {
      await apiClient.get('/test/no-retry-on-4xx');
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(400);
    }
  });
});
