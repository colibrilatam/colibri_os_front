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

describe('client retry logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRetryCounter();
  });

  it('should retry on network error and succeed', async () => {
    const response = await apiClient.get('/test/retry-then-success');
    expect(response.data).toEqual({ data: 'recovered', attempt: 2 });
  }, 15000);

  it('should call onRetry callback during retries', async () => {
    const onRetry = vi.fn();

    const response = await apiClient.get('/test/retry-then-success', { onRetry });

    expect(onRetry).toHaveBeenCalledWith(1, 2);
    expect(response.data).toEqual({ data: 'recovered', attempt: 2 });
  }, 15000);

  it('should throw ApiError after exhausting retries', async () => {
    try {
      await apiClient.get('/test/retry-always-fails');
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
    }
  }, 15000);

  it('should NOT retry on 4xx errors', async () => {
    try {
      await apiClient.get('/test/no-retry-on-4xx');
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.status).toBe(400);
    }
  }, 5000);
});
