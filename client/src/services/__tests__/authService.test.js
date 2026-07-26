import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService.js';
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

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should return user data on successful registration', async () => {
      const mockResponse = {
        data: {
          id: 1,
          email: 'test@example.com',
          token: 'mock-token',
        },
      };

      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/signup', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw ApiError on validation error', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Email inválido',
          status: 422,
          details: { field: 'email' },
        })
      );

      try {
        await authService.register({
          email: 'invalid-email',
          password: 'password123',
        });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
        expect(error.status).toBe(422);
      }
    });
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          user: { id: 1, email: 'test@example.com' },
        },
      };

      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse.data);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/signin', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw ApiError on invalid credentials', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Credenciales inválidas',
          status: 401,
        })
      );

      try {
        await authService.login({
          email: 'test@example.com',
          password: 'wrong-password',
        });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
        expect(error.status).toBe(401);
      }
    });
  });
});
