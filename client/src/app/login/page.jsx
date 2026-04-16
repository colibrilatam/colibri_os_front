'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import {
  validatePassword,
  getPasswordErrors,
  validateEmail,
} from '@/lib/validations';
import { useRegister } from '@/hooks/useRegister';
import { useLogin } from '@/hooks/useLogin';
import { useGuestLogin } from '@/hooks/useGuestLogin';
import NotificationPopup from '@/components/NotificationPopup';

export default function LoginRegisterPage() {
  const [view, setView] = useState('login'); // login | selectRole | register
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const { handleRegister } = useRegister();
  const { handleLogin } = useLogin();
  const { handleGuestLogin } = useGuestLogin();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  });

  const isLogin = view === 'login';
  const isRegister = view === 'register';
  const isSelectRole = view === 'selectRole';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };
    if (isLogin) return;

    if (name === 'username') {
      newErrors.username =
        value.trim() === '' ? 'El nombre de usuario es requerido' : '';
    }

    if (name === 'email') {
      if (value.trim() === '') newErrors.email = 'El email es requerido';
      else if (!validateEmail(value))
        newErrors.email = 'El email no tiene un formato válido';
      else newErrors.email = '';
    }

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);

      if (value.trim() === '')
        newErrors.password = 'La contraseña es requerida';
      else if (!validation.isValid)
        newErrors.password = getPasswordErrors(validation).join(', ');
      else newErrors.password = '';

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      } else if (formData.confirmPassword === value) {
        newErrors.confirmPassword = '';
      }
    }

    if (name === 'confirmPassword') {
      if (value.trim() === '')
        newErrors.confirmPassword = 'Confirmar contraseña es requerido';
      else if (value !== formData.password)
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      else newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    if (isLogin) {
      return (
        formData.email && formData.password && !errors.email && !errors.password
      );
    } else {
      return (
        formData.username &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        !errors.username &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword &&
        passwordValidation.isValid
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      setLoading(true);
      const result = await handleLogin(formData);
      setLoading(false);

      if (result.success) {
        alert('¡Has iniciado sesión correctamente! Bienvenido a Colibri OS');
        router.push('/home');
      } else {
        alert(result.error);
      }
      return;
    }

    // REGISTER
    if (!selectedRole) {
      return alert('Seleccioná un rol');
    }

    if (!isFormValid()) {
      return alert(
        'Por favor, corrige los errores en el formulario antes de continuar.',
      );
    }

    setLoading(true);

    const result = await handleRegister({
      ...formData,
      role: selectedRole,
    });

    setLoading(false);

    if (result.success) {
      alert('¡Te has registrado correctamente! Bienvenido a Colibri OS');
      setView('login');
    } else {
      alert(result.error);
    }
  };

  const handleGoogleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  const handleGuestLoginClick = () => {
    const result = handleGuestLogin();
    if (result.success) {
      setPopupMessage(
        '¡Iniciaste sesión como invitado! Tu acceso será limitado.',
      );
      setIsPopupOpen(true);
    } else {
      alert(result.error);
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    router.push('/home');
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      {isPopupOpen && (
        <NotificationPopup
          message={popupMessage}
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
        />
      )}

      <div
        className={`w-full ${isSelectRole ? 'max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl' : 'max-w-md'} glass-effect-dark border-glass rounded-2xl p-6 sm:p-8 sm:p-10`}
      >
        <p className="text-overline text-center mb-2">Acceso al sistema</p>

        <h1 className="text-h1 text-center mb-2">
          {isLogin
            ? 'Iniciar sesión'
            : isSelectRole
              ? 'Elegir rol'
              : 'Crear cuenta'}
        </h1>

        <p className="text-body--muted text-center mb-8">
          {isLogin
            ? 'Ingresá a Colibrí OS'
            : isSelectRole
              ? 'Elegí cómo querés participar'
              : 'Registrate para comenzar'}
        </p>

        {/* SELECT ROLE */}
        {isSelectRole && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EMPRENDEDOR */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-200">
              <div>
                <div className="text-3xl mb-4">🚀</div>
                <p className="text-h2 mb-2">Emprendedor</p>
                <p className="text-body--muted mb-4">
                  Construí, validá y demostrá tu proyecto con evidencia real.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedRole('emprendedor');
                  setView('register');
                }}
                className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
              >
                Continuar como Emprendedor
              </button>
            </div>

            {/* MECENAS */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-200">
              <div>
                <div className="text-3xl mb-4">🤝</div>
                <p className="text-h2 mb-2">Mecenas</p>
                <p className="text-body--muted mb-4">
                  Apoyá proyectos con impacto sin tomar participación.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedRole('mecenas');
                  setView('register');
                }}
                className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
              >
                Continuar como Mecenas
              </button>
            </div>
          </div>
        )}

        {/* FORM */}
        {!isSelectRole && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="text-micro-label block mb-2">
                  Nombre completo
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                />
              </div>
            )}

            <div>
              <label className="text-micro-label block mb-2">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
            </div>

            <div>
              <label className="text-micro-label block mb-2">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
            </div>

            {isRegister && (
              <div>
                <label className="text-micro-label block mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-3 rounded-lg font-semibold transition 
    ${
      isFormValid()
        ? 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer'
        : 'bg-gray-500 cursor-not-allowed opacity-60'
    }`}
            >
              {isLogin ? 'Iniciar sesión' : 'Registrarse'}
            </button>
            {isRegister && (
              <button
                type="button"
                onClick={() => setView('selectRole')}
                className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
              >
                Volver atrás
              </button>
            )}
          </form>
        )}

        {/* LOGIN EXTRA */}
        {isLogin && (
          <>
            <button
              onClick={handleGoogleClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              Continuar con Google
            </button>

            <button
              onClick={handleGuestLoginClick}
              className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
            >
              Entrar como invitado
            </button>
          </>
        )}

        <p className="text-center text-body--muted mt-6">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            onClick={() => setView(isLogin ? 'selectRole' : 'login')}
            className="text-[var(--text-link)] font-semibold cursor-pointer"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
