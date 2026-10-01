import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from '../useLogin.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';
import { createElement } from 'react';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function createWrapper() {
  const queryClient = createTestQueryClient();
  return ({ children }) => createElement(QueryClientProvider, { client: queryClient }, children);
}

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

      const mockAuthResponseData = mockAuthResponse();
      const mockUserData = mockUser();

      authService.login.mockResolvedValueOnce(mockAuthResponseData);
      userService.profile.mockResolvedValueOnce(mockUserData);

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.handleLogin({ email: 'test@example.com', password: 'password123' });
      });

      expect(loginResult.success).toBe(true);
      expect(loginResult.data.user).toEqual(mockUserData);
      expect(loginResult.data.message).toBe('Usuario logueado con éxito');
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

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

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

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

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
      const mockUserData = mockUser();

      userService.profile.mockResolvedValueOnce(mockUserData);

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      let dataResult;
      await act(async () => {
        dataResult = await result.current.userData();
      });

      expect(dataResult.data).toEqual(mockUserData);
      expect(dataResult.error).toBeNull();
    });
  });

  describe('handleDemoLogin', () => {
    it('should login with emprendedor credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');

      const mockAuthResponseData = mockAuthResponse({ user: mockUser({ email: 'ana@colibri.com' }) });
      const mockUserData = mockUser({ email: 'ana@colibri.com' });

      authService.login.mockResolvedValueOnce(mockAuthResponseData);
      userService.profile.mockResolvedValueOnce(mockUserData);

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      let loginResult;
      await act(async () => {
        loginResult = await result.current.handleDemoLogin('emprendedor');
      });

      expect(loginResult.data.user).toEqual(mockUserData);
      expect(authService.login).toHaveBeenCalledWith({
        email: 'ana@colibri.com',
        password: 'Test@1234',
      });
    });

    it('should login with mecenas credentials', async () => {
      const { authService } = await import('@/services/authService');
      const { userService } = await import('@/services/user');

      const mockAuthResponseData = mockAuthResponse({ user: mockUser({ email: 'mecenas@colibri.com', role: 'mentor' }) });
      const mockUserData = mockUser({ email: 'mecenas@colibri.com', role: 'mentor' });

      authService.login.mockResolvedValueOnce(mockAuthResponseData);
      userService.profile.mockResolvedValueOnce(mockUserData);

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

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

      const mockAuthResponseData = mockAuthResponse({ user: mockUser({ email: 'mentor@colibri.com', role: 'mentor' }) });
      const mockUserData = mockUser({ email: 'mentor@colibri.com', role: 'mentor' });

      authService.login.mockResolvedValueOnce(mockAuthResponseData);
      userService.profile.mockResolvedValueOnce(mockUserData);

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

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
    it('should expose retrying state as false by default', () => {
      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

      expect(result.current.retrying).toBe(false);
    });
  });
});
