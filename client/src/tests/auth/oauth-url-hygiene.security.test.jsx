import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import GoogleCallback from '@/app/login/google-callback/page.jsx';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function QueryWrapper({ children }) {
  return createElement(QueryClientProvider, { client: createTestQueryClient() }, children);
}

vi.stubGlobal('console', { ...console, log: vi.fn(), error: vi.fn() });

const mockReplace = vi.fn();
const mockPush = vi.fn();

let searchParamsGetter = () => new URLSearchParams('');

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  useSearchParams: () => searchParamsGetter(),
}));

const translationMap = {
  loggingIn: 'Iniciando sesión...',
};

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key) => translationMap[key] || key,
  }),
}));

const mockExchangeGoogleCode = vi.fn();
const mockCompleteProfile = vi.fn();

vi.mock('@/services/authService', () => ({
  authService: {
    exchangeGoogleCode: (...args) => mockExchangeGoogleCode(...args),
    completeProfile: (...args) => mockCompleteProfile(...args),
  },
}));

const mockSetUser = vi.fn();
const mockSetRol = vi.fn();

vi.mock('@/lib/store', () => ({
  useUserStore: vi.fn((selector) => {
    const state = {
      setUser: mockSetUser,
      setRol: mockSetRol,
      user: null,
      rol: null,
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock('@/components/login/SelectRole', () => {
  return {
    default: function MockSelectRole({ onSelectRole }) {
      return (
        <div data-testid="select-role">
          <button onClick={() => onSelectRole('entrepreneur')}>Emprendedor</button>
          <button onClick={() => onSelectRole('evaluator')}>Evaluador</button>
        </div>
      );
    },
  };
});

function clearAllCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

function getStorageEntries(storage) {
  const entries = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    entries.push({ key, value: storage.getItem(key) });
  }
  return entries;
}

function hasStorageEntryWithValue(storage, value) {
  return getStorageEntries(storage).some((entry) => entry.value && entry.value.includes(value));
}

function hasCookieWithValue(value) {
  return document.cookie.split(';').some((c) => c.trim().includes(value));
}

describe('OAuth URL Hygiene Security', () => {
  const TEST_CODE = 'abc123';
  const TEST_PCT = 'pct-xyz';
  const TEST_USER = { id: 1, email: 'a@b.c', role: 'entrepreneur', fullName: 'Test User' };
  const TEST_USER_NO_ROLE = { id: 1, email: 'a@b.c', role: null, fullName: 'Test User' };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    clearAllCookies();
    searchParamsGetter = () => new URLSearchParams(`code=${TEST_CODE}`);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearAllCookies();
  });

  it('limpia la URL antes de llamar a exchangeGoogleCode', async () => {
    const events = [];
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = vi.fn((...args) => {
      events.push('replaceState');
      return originalReplaceState.apply(window.history, args);
    });
    mockExchangeGoogleCode.mockImplementation(async () => {
      events.push('exchange');
      return { requiresProfileCompletion: false, user: TEST_USER };
    });

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(events).toContain('replaceState');
      expect(events).toContain('exchange');
    });

    const replaceIdx = events.indexOf('replaceState');
    const exchangeIdx = events.indexOf('exchange');
    expect(replaceIdx).toBeLessThan(exchangeIdx);

    window.history.replaceState = originalReplaceState;
  });

  it('invoca exchangeGoogleCode con el code correcto', async () => {
    mockExchangeGoogleCode.mockResolvedValue({ requiresProfileCompletion: false, user: TEST_USER });

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(mockExchangeGoogleCode).toHaveBeenCalledTimes(1);
      expect(mockExchangeGoogleCode).toHaveBeenCalledWith(TEST_CODE);
    });
  });

  it('no persiste nada en localStorage ni sessionStorage tras mount+flush', async () => {
    mockExchangeGoogleCode.mockResolvedValue({ requiresProfileCompletion: false, user: TEST_USER });

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(mockExchangeGoogleCode).toHaveBeenCalled();
    });

    expect(getStorageEntries(localStorage).length).toBe(0);
    expect(getStorageEntries(sessionStorage).length).toBe(0);
  });

  it('no deja el code en cookies accesibles', async () => {
    mockExchangeGoogleCode.mockResolvedValue({ requiresProfileCompletion: false, user: TEST_USER });

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(mockExchangeGoogleCode).toHaveBeenCalled();
    });

    expect(hasCookieWithValue(TEST_CODE)).toBe(false);
  });

  it('no deja el code en window.location tras la limpieza', async () => {
    mockExchangeGoogleCode.mockResolvedValue({ requiresProfileCompletion: false, user: TEST_USER });

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(mockExchangeGoogleCode).toHaveBeenCalled();
    });

    expect(window.location.search).not.toContain(TEST_CODE);
  });

  it('redirige a error si falta ?code', async () => {
    searchParamsGetter = () => new URLSearchParams('');

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login?error=google_failed');
    });
    expect(mockExchangeGoogleCode).not.toHaveBeenCalled();
  });

  it('redirige a error si el exchange rechaza', async () => {
    mockExchangeGoogleCode.mockRejectedValue(new Error('Invalid code'));

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login?error=google_failed');
    });
  });

  it('profileCompletionToken vive solo en memoria, no en storage', async () => {
    mockExchangeGoogleCode.mockResolvedValue({
      requiresProfileCompletion: true,
      profileCompletionToken: TEST_PCT,
      user: TEST_USER_NO_ROLE,
    });

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('select-role')).toBeTruthy();
    });

    expect(hasStorageEntryWithValue(localStorage, TEST_PCT)).toBe(false);
    expect(hasStorageEntryWithValue(sessionStorage, TEST_PCT)).toBe(false);
    expect(hasStorageEntryWithValue(localStorage, 'profileCompletionToken')).toBe(false);
    expect(hasStorageEntryWithValue(sessionStorage, 'profileCompletionToken')).toBe(false);
  });

  it('no procesa tempToken ni role desde URL (solo code)', async () => {
    searchParamsGetter = () => new URLSearchParams('tempToken=leaked&role=admin');

    render(<GoogleCallback />, { wrapper: QueryWrapper });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login?error=google_failed');
    });
    expect(mockExchangeGoogleCode).not.toHaveBeenCalled();
  });
});