import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegister } from '../useRegister.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

vi.mock('@/services/authService', () => ({
  authService: {
    register: vi.fn(),
  },
}));

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleRegister', () => {
    it('should register successfully', async () => {
      const { authService } = await import('@/services/authService');
      const mockResponse = { id: 1, email: 'test@example.com', token: 'new-token' };

      authService.register.mockResolvedValueOnce(mockResponse);

      const { handleRegister } = useRegister();
      const result = await handleRegister({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
    });

    it('should return error on validation failure', async () => {
      const { authService } = await import('@/services/authService');

      authService.register.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Email inválido',
          status: 422,
          details: { field: 'email' },
        })
      );

      const { handleRegister } = useRegister();
      const result = await handleRegister({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email inválido');
    });

    it('should return error on duplicate email', async () => {
      const { authService } = await import('@/services/authService');

      authService.register.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.CONFLICT,
          message: 'El email ya está registrado',
          status: 409,
        })
      );

      const { handleRegister } = useRegister();
      const result = await handleRegister({
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('El email ya está registrado');
    });

    it('should return generic error for non-ApiError', async () => {
      const { authService } = await import('@/services/authService');

      authService.register.mockRejectedValueOnce(new Error('Network error'));

      const { handleRegister } = useRegister();
      const result = await handleRegister({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al registrarse');
    });
  });
});
