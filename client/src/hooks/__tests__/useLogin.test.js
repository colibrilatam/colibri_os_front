import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    return selector(state);
  }),
}));

vi.mock('@/lib/themeMock', () => ({
  unimetTheme: { name: 'unimet' },
  bancoVenezuelaTheme: { name: 'bancoVenezuela' },
}));

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleLogin', () => {
    it('should login successfully and set user data', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');
      const { useUserStore } = await import('@/lib/store');

      const mockToken = 'mock-jwt-token';
      const mockUser = { id: 1, email: 'test@example.com', role: 'CEO' };

      authService.login.mockResolvedValueOnce({ token: mockToken });
      userService.profile.mockResolvedValueOnce(mockUser);

      const setToken = vi.fn();
      const setRol = vi.fn();
      const setUser = vi.fn();

      useUserStore.mockImplementation((selector) => {
        const state = { setToken, setRol, setUser };
        return selector(state);
      });

      const { handleLogin } = useLogin();
      const result = await handleLogin({ email: 'test@example.com', password: 'password123' });

      expect(result.success).toBe(true);
      expect(result.data.token).toBe(mockToken);
      expect(setToken).toHaveBeenCalledWith(mockToken);
      expect(setRol).toHaveBeenCalledWith('CEO');
      expect(setUser).toHaveBeenCalledWith(mockUser);
    });

    it('should apply unimetTheme for mecenas email', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');
      const { useUserStore } = await import('@/lib/store');

      authService.login.mockResolvedValueOnce({ token: 'token' });
      userService.profile.mockResolvedValueOnce({ id: 1, email: 'mecenas@colibri.com', role: 'MENTOR' });

      const setToken = vi.fn();
      const setRol = vi.fn();
      const setUser = vi.fn();

      useUserStore.mockImplementation((selector) => selector({ setToken, setRol, setUser }));

      const { handleLogin } = useLogin();
      const result = await handleLogin({ email: 'mecenas@colibri.com', password: 'password' });

      expect(result.success).toBe(true);
      expect(setUser).toHaveBeenCalledWith(expect.objectContaining({
        theme: { name: 'unimet' },
      }));
    });

    it('should return error on login failure', async () => {
      const { authService } = await import('@/services/authService');
      const { useUserStore } = await import('@/lib/store');

      authService.login.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Credenciales inválidas',
          status: 401,
        })
      );

      useUserStore.mockImplementation((selector) => selector({
        setToken: vi.fn(),
        setRol: vi.fn(),
        setUser: vi.fn(),
      }));

      const { handleLogin } = useLogin();
      const result = await handleLogin({ email: 'test@example.com', password: 'wrong' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales inválidas');
    });

    it('should return generic error message for non-ApiError', async () => {
      const { authService } = await import('@/services/authService');
      const { useUserStore } = await import('@/lib/store');

      authService.login.mockRejectedValueOnce(new Error('Network error'));

      useUserStore.mockImplementation((selector) => selector({
        setToken: vi.fn(),
        setRol: vi.fn(),
        setUser: vi.fn(),
      }));

      const { handleLogin } = useLogin();
      const result = await handleLogin({ email: 'test@example.com', password: 'password' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al iniciar sesión');
    });
  });

  describe('userData', () => {
    it('should return user profile data', async () => {
      const { userService } = await import('@/services/user');
      const mockUser = { id: 1, email: 'test@example.com' };

      userService.profile.mockResolvedValueOnce(mockUser);

      const { userData } = useLogin();
      const result = await userData();

      expect(result.data).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should return error on profile fetch failure', async () => {
      const { userService } = await import('@/services/user');

      userService.profile.mockRejectedValueOnce(
        new ApiError({
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Token expirado',
          status: 401,
        })
      );

      const { userData } = useLogin();
      const result = await userData();

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(ApiError);
      expect(result.error.message).toBe('Token expirado');
    });
  });

  describe('handleDemoLogin', () => {
    it('should login with emprendedor credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');
      const { useUserStore } = await import('@/lib/store');

      authService.login.mockResolvedValueOnce({ token: 'demo-token' });
      userService.profile.mockResolvedValueOnce({ id: 1, email: 'ana@colibri.com', role: 'CEO' });

      const setToken = vi.fn();
      const setRol = vi.fn();
      const setUser = vi.fn();

      useUserStore.mockImplementation((selector) => selector({ setToken, setRol, setUser }));

      const { handleDemoLogin } = useLogin();
      const result = await handleDemoLogin('emprendedor');

      expect(result.data.token).toBe('demo-token');
      expect(authService.login).toHaveBeenCalledWith({
        email: 'ana@colibri.com',
        password: 'Test@1234',
      });
    });

    it('should login with mecenas credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');
      const { useUserStore } = await import('@/lib/store');

      authService.login.mockResolvedValueOnce({ token: 'demo-token' });
      userService.profile.mockResolvedValueOnce({ id: 2, email: 'mecenas@colibri.com', role: 'MENTOR' });

      const setToken = vi.fn();
      const setRol = vi.fn();
      const setUser = vi.fn();

      useUserStore.mockImplementation((selector) => selector({ setToken, setRol, setUser }));

      const { handleDemoLogin } = useLogin();
      const result = await handleDemoLogin('mecenas');

      expect(authService.login).toHaveBeenCalledWith({
        email: 'mecenas@colibri.com',
        password: 'Test@1234',
      });
    });

    it('should login with mentor credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');
      const { useUserStore } = await import('@/lib/store');

      authService.login.mockResolvedValueOnce({ token: 'demo-token' });
      userService.profile.mockResolvedValueOnce({ id: 3, email: 'mentor@colibri.com', role: 'MENTOR' });

      const setToken = vi.fn();
      const setRol = vi.fn();
      const setUser = vi.fn();

      useUserStore.mockImplementation((selector) => selector({ setToken, setRol, setUser }));

      const { handleDemoLogin } = useLogin();
      const result = await handleDemoLogin('mentor');

      expect(authService.login).toHaveBeenCalledWith({
        email: 'mentor@colibri.com',
        password: 'Test@1234',
      });
    });
  });
});
