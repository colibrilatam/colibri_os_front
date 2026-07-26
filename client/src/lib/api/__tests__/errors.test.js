import { describe, it, expect } from 'vitest';
import { ApiError } from '../errors.js';
import { ERROR_CODES } from '../types.js';

describe('ApiError', () => {
  it('should create ApiError with all fields', () => {
    const error = new ApiError({
      code: ERROR_CODES.UNAUTHORIZED,
      message: 'Token expired',
      status: 401,
      details: { reason: 'expired' },
      requestId: 'test-123',
      isNetworkError: false,
    });

    expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
    expect(error.message).toBe('Token expired');
    expect(error.status).toBe(401);
    expect(error.details).toEqual({ reason: 'expired' });
    expect(error.requestId).toBe('test-123');
    expect(error.isNetworkError).toBe(false);
    expect(error.name).toBe('ApiError');
  });

  it('should create generic error', () => {
    const error = ApiError.generic('Something went wrong');
    expect(error.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
    expect(error.message).toBe('Something went wrong');
    expect(error.status).toBeNull();
    expect(error.requestId).toBeDefined();
  });

  it('should create ApiError from axios 401 error', () => {
    const axiosError = {
      response: {
        status: 401,
        data: { message: 'Invalid token' },
      },
    };

    const apiError = ApiError.fromAxiosError(axiosError, 'req-123');
    expect(apiError.code).toBe(ERROR_CODES.UNAUTHORIZED);
    expect(apiError.status).toBe(401);
    expect(apiError.requestId).toBe('req-123');
  });

  it('should create ApiError from axios 422 error', () => {
    const axiosError = {
      response: {
        status: 422,
        data: {
          message: ['email is required', 'password too short'],
        },
      },
    };

    const apiError = ApiError.fromAxiosError(axiosError);
    expect(apiError.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(apiError.status).toBe(422);
    expect(Array.isArray(apiError.details)).toBe(true);
  });

  it('should create ApiError from timeout error', () => {
    const axiosError = {
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded',
    };

    const apiError = ApiError.fromAxiosError(axiosError);
    expect(apiError.code).toBe(ERROR_CODES.TIMEOUT);
    expect(apiError.isNetworkError).toBe(true);
    expect(apiError.status).toBeNull();
  });

  it('should create ApiError from network error', () => {
    const axiosError = {
      message: 'Network Error',
    };

    const apiError = ApiError.fromAxiosError(axiosError);
    expect(apiError.code).toBe(ERROR_CODES.NETWORK_ERROR);
    expect(apiError.isNetworkError).toBe(true);
  });
});
