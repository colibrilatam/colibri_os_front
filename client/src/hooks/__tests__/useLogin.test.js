import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../useLogin.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock('@/services/user', () => ({
  userService: {
    profile: vi.fn(),
  },
}));

vi.mock('@/lib/store', () => ({
  useUserStore: vi.fn((selector) => {
    const state = {
      setToken: vi.fn(),
      setRol: vi.fn(),
      setUser: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock('@/lib/themeMock', () => ({
  unimetTheme: { name: 'unimet' },
  bancoVenezuelaTheme: { name: 'bancoVenezuela' },
}));

vi.mock('@/lib/api', () => ({
  setRetryListener: vi.fn(),
}));

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleLogin', () => {
    it('should login successfully and set user data', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');

      const mockToken = 'mock-jwt-token';
      const mockUser = { id: 1, email: 'test@example.com', role: 'CEO' };

      authService.login.mockResolvedValueOnce({ token: mockToken });
      userService.profile.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.handleLogin({ email: 'test@example.com', password: 'password123' });
      });

      expect(loginResult.success).toBe(true);
      expect(loginResult.data.token).toBe(mockToken);
    });

    it('should return error on login failure', async () => {
      const { authService } = await import('@/services/authService');

      authService.login.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Credenciales inválidas',
          status: 401,
        })
      );

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.handleLogin({ email: 'test@example.com', password: 'wrong' });
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Credenciales inválidas');
    });

    it('should return generic error message for non-ApiError', async () => {
      const { authService } = await import('@/services/authService');

      authService.login.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.handleLogin({ email: 'test@example.com', password: 'password' });
      });

      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Error al iniciar sesión');
    });
  });

  describe('userData', () => {
    it('should return user profile data', async () => {
      const { userService } = await import('@/services/user');
      const mockUser = { id: 1, email: 'test@example.com' };

      userService.profile.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useLogin());

      let dataResult;
      await act(async () => {
        dataResult = await result.current.userData();
      });

      expect(dataResult.data).toEqual(mockUser);
      expect(dataResult.error).toBeNull();
    });
  });

  describe('handleDemoLogin', () => {
    it('should login with emprendedor credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');

      authService.login.mockResolvedValueOnce({ token: 'demo-token' });
      userService.profile.mockResolvedValueOnce({ id: 1, email: 'ana@colibri.com', role: 'CEO' });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.handleDemoLogin('emprendedor');
      });

      expect(loginResult.data.token).toBe('demo-token');
      expect(authService.login).toHaveBeenCalledWith({
        email: 'ana@colibri.com',
        password: 'Test@1234',
      });
    });

    it('should login with mecenas credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');

      authService.login.mockResolvedValueOnce({ token: 'demo-token' });
      userService.profile.mockResolvedValueOnce({ id: 2, email: 'mecenas@colibri.com', role: 'MENTOR' });

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.handleDemoLogin('mecenas');
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'mecenas@colibri.com',
        password: 'Test@1234',
      });
    });

    it('should login with mentor credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');

      authService.login.mockResolvedValueOnce({ token: 'demo-token' });
      userService.profile.mockResolvedValueOnce({ id: 3, email: 'mentor@colibri.com', role: 'MENTOR' });

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.handleDemoLogin('mentor');
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'mentor@colibri.com',
        password: 'Test@1234',
      });
    });
  });

  describe('retrying', () => {
    it('should register retry listener on mount and cleanup on unmount', async () => {
      const { setRetryListener } = await import('@/lib/api');

      const { unmount } = renderHook(() => useLogin());

      expect(setRetryListener).toHaveBeenCalledWith(expect.any(Function));

      unmount();

      expect(setRetryListener).toHaveBeenCalledWith(null);
    });

    it('should expose retrying state', () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current.retrying).toBe(false);
    });
  });
});
