import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Login from '@/components/login/Login.jsx';
import Register from '@/components/login/Register.jsx';

// Suprimir logs de debug del componente Register
vi.stubGlobal('console', { ...console, log: vi.fn() });

// --- Mocks ---
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const translationMap = {
  email: 'Email',
  password: 'Password',
  loginSubmit: 'Iniciar sesión',
  errorRequiredEmail: 'El email es requerido',
  errorInvalidEmail: 'Email inválido',
  errorRequiredPassword: 'La contraseña es requerida',
  errorFormInvalid: 'Formulario inválido',
  errorUserInfo: 'Error al obtener información del usuario',
  errorFetchProjects: 'Error al obtener proyectos',
  retryMessage: 'Reintentando...',
  fullName: 'Nombre completo',
  confirmPassword: 'Confirmar contraseña',
  errorRequiredName: 'El nombre es requerido',
  errorRequiredConfirmPassword: 'Confirma tu contraseña',
  errorPasswordLength: 'Mínimo 8 caracteres',
  errorPasswordUppercase: 'Una mayúscula',
  errorPasswordNumber: 'Un número',
  errorPasswordSpecial: 'Un carácter especial',
  errorPasswordsNotMatch: 'Las contraseñas no coinciden',
  passwordRequirements: 'Requisitos de contraseña',
  reqMinLength: 'Mínimo 8 caracteres',
  reqNumber: 'Un número',
  reqUppercase: 'Una mayúscula',
  reqSpecialChar: 'Un carácter especial',
  registerSubmit: 'Registrarse',
  registering: 'Registrando...',
  registerHint: 'Completa todos los requisitos',
  backAlt: 'Volver',
  errorCreateUser: 'Error al crear usuario:',
  errorUnknown: 'Error desconocido',
  errorConnection: 'Error de conexión',
};

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key) => translationMap[key] || key,
  }),
}));

const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('@/services/authService', () => ({
  authService: {
    login: (...args) => mockLogin(...args),
    register: (...args) => mockRegister(...args),
  },
}));

const mockProfile = vi.fn();

vi.mock('@/services/user', () => ({
  userService: {
    profile: (...args) => mockProfile(...args),
  },
}));

vi.mock('@/services/project', () => ({
  projectsService: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}));

const mockSetToken = vi.fn();
const mockSetRol = vi.fn();
const mockSetUser = vi.fn();
const mockSetIsDemo = vi.fn();
const mockLogout = vi.fn();

vi.mock('@/lib/store', () => ({
  useUserStore: vi.fn((selector) => {
    const state = {
      setToken: mockSetToken,
      setRol: mockSetRol,
      setUser: mockSetUser,
      isDemo: false,
      setIsDemo: mockSetIsDemo,
      logout: mockLogout,
      token: null,
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock('@/lib/themeMock', () => ({
  unimetTheme: {},
  bancoVenezuelaTheme: {},
}));

vi.mock('@/lib/api', () => ({
  setRetryListener: vi.fn(),
}));

// --- Helpers ---
function typeInInput(element, value) {
  fireEvent.change(element, { target: { value } });
}

function getAllStorageEntries(storage) {
  const entries = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    entries.push({ key, value: storage.getItem(key) });
  }
  return entries;
}

function findPasswordInStorage(storage, password) {
  return getAllStorageEntries(storage).filter((entry) =>
    entry.value && entry.value.includes(password),
  );
}

function getPasswordFromCookies(password) {
  return document.cookie
    .split(';')
    .filter(Boolean)
    .map((c) => c.trim())
    .filter((c) => c.includes(password));
}

function getInputByName(container, name) {
  return container.querySelector(`input[name="${name}"]`);
}

function clearAllCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

// --- Tests ---
describe('Password Storage Security', () => {
  const TEST_PASSWORD = 'SuperSecret@123';
  const TEST_EMAIL = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    clearAllCookies();
    window.alert = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearAllCookies();
  });

  describe('Login Component', () => {
    beforeEach(() => {
      mockLogin.mockResolvedValue({ token: 'jwt-token-abc' });
      mockProfile.mockResolvedValue({ role: 'entrepreneur', sub: 1 });
    });

    it('no guarda la contraseña en localStorage después de un login exitoso', async () => {
      const { container } = render(<Login />);

      typeInInput(getInputByName(container, 'email'), TEST_EMAIL);
      typeInInput(getInputByName(container, 'password'), TEST_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));
      });

      await waitFor(() => {
        expect(findPasswordInStorage(window.localStorage, TEST_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda la contraseña en sessionStorage después de un login exitoso', async () => {
      const { container } = render(<Login />);

      typeInInput(getInputByName(container, 'email'), TEST_EMAIL);
      typeInInput(getInputByName(container, 'password'), TEST_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));
      });

      await waitFor(() => {
        expect(findPasswordInStorage(window.sessionStorage, TEST_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda la contraseña en cookies después de un login exitoso', async () => {
      const { container } = render(<Login />);

      typeInInput(getInputByName(container, 'email'), TEST_EMAIL);
      typeInInput(getInputByName(container, 'password'), TEST_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));
      });

      await waitFor(() => {
        expect(getPasswordFromCookies(TEST_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda la contraseña en ningún storage después de un login fallido', async () => {
      mockLogin.mockRejectedValue(new Error('Credenciales inválidas'));

      const { container } = render(<Login />);

      typeInInput(getInputByName(container, 'email'), TEST_EMAIL);
      typeInInput(getInputByName(container, 'password'), TEST_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));
      });

      await waitFor(() => {
        expect(findPasswordInStorage(window.localStorage, TEST_PASSWORD)).toHaveLength(0);
        expect(findPasswordInStorage(window.sessionStorage, TEST_PASSWORD)).toHaveLength(0);
        expect(getPasswordFromCookies(TEST_PASSWORD)).toHaveLength(0);
      });
    });

    it('envía email y password al servicio de login, pero no los persiste en storage', async () => {
      const { container } = render(<Login />);

      typeInInput(getInputByName(container, 'email'), TEST_EMAIL);
      typeInInput(getInputByName(container, 'password'), TEST_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }));
      });

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({ email: TEST_EMAIL, password: TEST_PASSWORD });
        expect(findPasswordInStorage(window.localStorage, TEST_PASSWORD)).toHaveLength(0);
        expect(findPasswordInStorage(window.sessionStorage, TEST_PASSWORD)).toHaveLength(0);
        expect(getPasswordFromCookies(TEST_PASSWORD)).toHaveLength(0);
      });
    });
  });

  describe('Register Component', () => {
    const SUBMIT_PASSWORD = 'MyStr0ng!Pass';
    const renderRegister = (props = {}) => {
      const defaultProps = {
        selectedRole: 'entrepreneur',
        onSuccess: vi.fn(),
        onBack: vi.fn(),
        onLoadingChange: vi.fn(),
      };
      return render(<Register {...defaultProps} {...props} />);
    };

    beforeEach(() => {
      mockRegister.mockResolvedValue({ token: 'jwt-token-abc' });
    });

    it('no guarda la contraseña en localStorage mientras el usuario escribe', async () => {
      const { container } = renderRegister();

      typeInInput(getInputByName(container, 'password'), SUBMIT_PASSWORD);

      await waitFor(() => {
        expect(findPasswordInStorage(window.localStorage, SUBMIT_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda la contraseña en sessionStorage mientras el usuario escribe', async () => {
      const { container } = renderRegister();

      typeInInput(getInputByName(container, 'password'), SUBMIT_PASSWORD);

      await waitFor(() => {
        expect(findPasswordInStorage(window.sessionStorage, SUBMIT_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda valores reales de password en el backup de sessionStorage', async () => {
      const { container } = renderRegister();

      typeInInput(getInputByName(container, 'fullName'), 'Juan Perez');
      typeInInput(getInputByName(container, 'email'), 'juan@test.com');
      typeInInput(getInputByName(container, 'password'), SUBMIT_PASSWORD);
      typeInInput(getInputByName(container, 'confirmPassword'), SUBMIT_PASSWORD);

      await waitFor(() => {
        expect(findPasswordInStorage(window.sessionStorage, SUBMIT_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda la contraseña en cookies durante el registro', async () => {
      const { container } = renderRegister();

      typeInInput(getInputByName(container, 'fullName'), 'Juan Perez');
      typeInInput(getInputByName(container, 'email'), 'juan@test.com');
      typeInInput(getInputByName(container, 'password'), SUBMIT_PASSWORD);
      typeInInput(getInputByName(container, 'confirmPassword'), SUBMIT_PASSWORD);

      await waitFor(() => {
        expect(getPasswordFromCookies(SUBMIT_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda la contraseña en ningún storage después de un registro exitoso', async () => {
      const onSuccess = vi.fn();
      const { container } = renderRegister({ onSuccess });

      typeInInput(getInputByName(container, 'fullName'), 'Juan Perez');
      typeInInput(getInputByName(container, 'email'), 'juan@test.com');
      typeInInput(getInputByName(container, 'password'), SUBMIT_PASSWORD);
      typeInInput(getInputByName(container, 'confirmPassword'), SUBMIT_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));
      });

      await waitFor(() => {
        expect(findPasswordInStorage(window.localStorage, SUBMIT_PASSWORD)).toHaveLength(0);
        expect(findPasswordInStorage(window.sessionStorage, SUBMIT_PASSWORD)).toHaveLength(0);
        expect(getPasswordFromCookies(SUBMIT_PASSWORD)).toHaveLength(0);
      });
    });

    it('no guarda la contraseña en ningún storage después de un registro fallido', async () => {
      mockRegister.mockRejectedValue(new Error('Email ya existe'));

      const { container } = renderRegister();

      typeInInput(getInputByName(container, 'fullName'), 'Juan Perez');
      typeInInput(getInputByName(container, 'email'), 'juan@test.com');
      typeInInput(getInputByName(container, 'password'), SUBMIT_PASSWORD);
      typeInInput(getInputByName(container, 'confirmPassword'), SUBMIT_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));
      });

      await waitFor(() => {
        expect(findPasswordInStorage(window.localStorage, SUBMIT_PASSWORD)).toHaveLength(0);
        expect(findPasswordInStorage(window.sessionStorage, SUBMIT_PASSWORD)).toHaveLength(0);
        expect(getPasswordFromCookies(SUBMIT_PASSWORD)).toHaveLength(0);
      });
    });

    it('envía los datos de registro incluyendo password al servicio, pero no la persiste en storage', async () => {
      const { container } = renderRegister();

      typeInInput(getInputByName(container, 'fullName'), 'Juan Perez');
      typeInInput(getInputByName(container, 'email'), 'juan@test.com');
      typeInInput(getInputByName(container, 'password'), SUBMIT_PASSWORD);
      typeInInput(getInputByName(container, 'confirmPassword'), SUBMIT_PASSWORD);

      await act(async () => {
        fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));
      });

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          expect.objectContaining({ password: SUBMIT_PASSWORD }),
        );
        expect(findPasswordInStorage(window.localStorage, SUBMIT_PASSWORD)).toHaveLength(0);
        expect(findPasswordInStorage(window.sessionStorage, SUBMIT_PASSWORD)).toHaveLength(0);
        expect(getPasswordFromCookies(SUBMIT_PASSWORD)).toHaveLength(0);
      });
    });
  });
});
