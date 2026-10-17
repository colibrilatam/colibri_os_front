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

function mockUser(overrides = {}) {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    fullName: 'Test User',
    role: 'entrepreneur',
    status: 'active',
    provider: 'local',
    linkedinId: null,
    googleId: null,
    cryptoWallet: null,
    credentialsWallet: null,
    adnHash: null,
    bio: null,
    avatar: null,
    gender: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mockAuthResponse(overrides = {}) {
  return {
    message: 'Usuario logueado con éxito',
    user: mockUser(),
    ...overrides,
  };
}

function mockRegisterResponse(overrides = {}) {
  return {
    message: 'Usuario registrado con éxito',
    user: mockUser(),
    ...overrides,
  };
}

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should return user data on successful registration', async () => {
      const mockResponse = {
        data: mockRegisterResponse(),
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
    it('should return user on successful login', async () => {
      const mockResponse = {
        data: mockAuthResponse(),
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
