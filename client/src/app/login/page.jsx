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
  const [view, setView] = useState('login');
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
    if (view === 'login') {
      return (
        formData.email &&
        formData.password &&
        !errors.email &&
        !errors.password &&
        passwordValidation.isValid
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

    if (!isLogin) {
      if (!isFormValid())
        return alert(
          'Por favor, corrige los errores en el formulario antes de continuar.',
        );
    }

    setLoading(true);

    if (isLogin) {
      const result = await handleLogin(formData);
      if (result.success) {
        alert('¡Has iniciado sesión correctamente! Bienvenido a Colibri OS');
        router.push('/home');
      } else {
        alert(result.error);
      }
    } else {
      const result = await handleRegister(formData);
      if (result.success) {
        alert('¡Te has registrado correctamente! Bienvenido a Colibri OS');
        switchView();
      } else {
        alert(result.error);
      }
    }

    setLoading(false);
  };

  const handleGoogleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google`;
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

  const switchView = () => {
    setView(view === 'login' ? 'register' : 'login');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setErrors({ username: '', email: '', password: '', confirmPassword: '' });
    setPasswordValidation({
      hasMinLength: false,
      hasUpperCase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isValid: false,
    });
  };

  if (loading) return <LoadingScreen />;

  const isLogin = view === 'login';

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      {isPopupOpen && (
        <NotificationPopup
          message={popupMessage}
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
        />
      )}

      <div className="w-full max-w-md glass-effect-dark border-glass rounded-2xl p-8 sm:p-10">
        <p className="text-overline text-center mb-2">Acceso al sistema</p>

        <h1 className="text-h1 text-center mb-2">
          {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
        </h1>

        <p className="text-body--muted text-center mb-8">
          {isLogin ? 'Ingresá a Colibrí OS' : 'Registrate para comenzar'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-micro-label block mb-2">
                Nombre completo
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-[var(--color-turquoise)] ${
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
              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-[var(--color-turquoise)] ${
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
              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-[var(--color-turquoise)] ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-micro-label block mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-[var(--color-turquoise)] ${
                  errors.confirmPassword ? 'border-red-500' : ''
                }`}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
          >
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </form>
        {isLogin && (
          <button
            onClick={handleGoogleClick}
            className="w-full mt-3 py-3 rounded-lg 
border border-white/10 
bg-white/5 
text-body 
hover:bg-white/10 
hover:border-white/20
transition-all duration-200
flex items-center justify-center gap-2 cursor-pointer"
          >
            Continuar con Google
          </button>
        )}

        {isLogin && (
          <button
            onClick={handleGuestLoginClick}
            className="w-full mt-3 py-3 rounded-lg 
border border-white/10 
bg-white/5 
text-body 
hover:bg-white/10 
hover:border-white/20
transition-all duration-200
flex items-center justify-center gap-2 cursor-pointer"
          >
            Entrar como invitado
          </button>
        )}
        {isLogin && (
          <button
            onClick={handleGuestLoginClick}
            className="w-full mt-3 py-3 rounded-lg 
border border-white/10 
bg-white/5 
text-body 
hover:bg-white/10 
hover:border-white/20
transition-all duration-200
flex items-center justify-center gap-2 cursor-pointer"
          >
            Entrar como Emprendedor
          </button>
        )}
        {isLogin && (
          <button
            onClick={handleGuestLoginClick}
            className="w-full mt-3 py-3 rounded-lg 
border border-white/10 
bg-white/5 
text-body 
hover:bg-white/10 
hover:border-white/20
transition-all duration-200
flex items-center justify-center gap-2 cursor-pointer"
          >
            Entrar como Mecenas
          </button>
        )}

        <p className="text-center text-body--muted mt-6">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            onClick={switchView}
            className="text-[var(--text-link)] hover:text-[var(--text-link-hover)] font-semibold cursor-pointer"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
