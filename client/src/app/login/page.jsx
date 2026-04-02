'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { validatePassword, getPasswordErrors, validateEmail } from '@/lib/validations';
import { useRegister } from '@/hooks/useRegister';
import { useLogin } from '@/hooks/useLogin';

export default function LoginRegisterPage() {
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { handleRegister } = useRegister();
  const { handleLogin } = useLogin();

  // Form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Form errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Password validation details
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  });

  // Real-time validation on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };
    if(isLogin) return;

    // Validation logic
    if (name === 'username') {
      if (value.trim() === '') {
        newErrors.username = 'El nombre de usuario es requerido';
      } else {
        newErrors.username = '';
      }
    }

    if (name === 'email') {
      if (value.trim() === '') {
        newErrors.email = 'El email es requerido';
      } else if (!validateEmail(value)) {
        newErrors.email = 'El email no tiene un formato válido';
      } else {
        newErrors.email = '';
      }
    }

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
      
      if (value.trim() === '') {
        newErrors.password = 'La contraseña es requerida';
      } else if (!validation.isValid) {
        const errorsList = getPasswordErrors(validation);
        newErrors.password = errorsList.join(', ');
      } else {
        newErrors.password = '';
      }
      
      // Check if confirmPassword matches password
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      } else if (formData.confirmPassword === value) {
        newErrors.confirmPassword = '';
      }
    }

    if (name === 'confirmPassword') {
      if (value.trim() === '') {
        newErrors.confirmPassword = 'Confirmar contraseña es requerido';
      } else if (value !== formData.password) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      } else {
        newErrors.confirmPassword = '';
      }
    }

    setErrors(newErrors);
  };

  // revisar si el formulario es v
  const isFormValid = () => {
    if (view === 'login') {
      return formData.email.trim() !== '' && 
             formData.password.trim() !== '' && 
             !errors.email && 
             !errors.password &&
             passwordValidation.isValid;
    } else {
      return formData.username.trim() !== '' && 
             formData.email.trim() !== '' && 
             formData.password.trim() !== '' &&
             formData.confirmPassword.trim() !== '' &&
             !errors.username && 
             !errors.email && 
             !errors.password &&
             !errors.confirmPassword &&
             passwordValidation.isValid;
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!isLogin){
      if (!isFormValid()) return alert('Por favor, corrige los errores en el formulario antes de continuar.');
    }

    setLoading(true);
    if(isLogin){
      //logica de inicio de sesión
      const result = await handleLogin(formData);
      if(result.success){
        alert('¡Has iniciado sesión correctamente! Bienvenido a Colibri OS');
        router.push('/'); // Redirige al dashboard u otra página protegida
      } else {
        alert(result.error) // o mostrarlo en un estado de error en el componente
      }
    } else { // Lógica del registro
    const result = await handleRegister(formData)
    if (result.success) {
      alert('¡Te has registrado correctamente! Bienvenido a Colibri OS');
      switchView(); // Cambia a la vista de login después del registro exitoso
    } else {
      alert(result.error) // o mostrarlo en un estado de error en el componente
    }
  }
  setLoading(false);
    
    // Se simula una llamada a la API con un delay de 1.5 segundos
  };

  // Handle Google button click
  const handleGoogleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}auth/google` // CAMBIAR VARIABLE DE ENTORNO
  };

  // Switch between views
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

  if (loading) {
    return <LoadingScreen />;
  }

  const isLogin = view === 'login';

  return (
    <div className=" flex items-center relative flex-col justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100 px-4 py-6">
        {/* Home button
      <Link
        href="/"
        className="top-4 left-4 absolute px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-slate-700 transition"
      >
        Volver al inicio
      </Link> 
       */}

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 text-center">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p className="text-center text-slate-500 text-lg sm:text-xl mb-8">
          {isLogin ? 'Bienvenido de vuelta' : 'Únete a nosotros hoy'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field (only in register) */}
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-base sm:text-lg font-medium text-slate-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="tu_usuario"
                className={`w-full px-4 py-3 border-2 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-500 text-black ${
                  errors.username ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm sm:text-base mt-2">{errors.username}</p>
              )}
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-base sm:text-lg font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu_email@ejemplo.com"
              className={`w-full px-4 py-3 border-2 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-500 text-black ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm sm:text-base mt-2">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-base sm:text-lg font-medium text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 6 caracteres con mayúscula, número y símbolo"
              className={`w-full px-4 py-3 border-2 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-500 text-black ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm sm:text-base mt-2">{errors.password}</p>
            )}
            
            {/* Password requirements display (only in register) */}
            {!isLogin && formData.password && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm sm:text-base font-semibold text-slate-700 mb-2">Requisitos:</p>
                <ul className="space-y-1 text-sm sm:text-base">
                  <li className={`flex items-center gap-2 ${passwordValidation.hasMinLength ? 'text-green-600' : 'text-slate-500'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasMinLength ? 'bg-green-600' : 'bg-slate-300'}`}>
                      {passwordValidation.hasMinLength && <span className="text-white text-xs">✓</span>}
                    </span>
                    Mínimo 6 caracteres
                  </li>
                  <li className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-slate-500'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasUpperCase ? 'bg-green-600' : 'bg-slate-300'}`}>
                      {passwordValidation.hasUpperCase && <span className="text-white text-xs">✓</span>}
                    </span>
                    Al menos 1 mayúscula (A-Z)
                  </li>
                  <li className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-slate-500'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasNumber ? 'bg-green-600' : 'bg-slate-300'}`}>
                      {passwordValidation.hasNumber && <span className="text-white text-xs">✓</span>}
                    </span>
                    Al menos 1 número (0-9)
                  </li>
                  <li className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-slate-500'}`}>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordValidation.hasSpecialChar ? 'bg-green-600' : 'bg-slate-300'}`}>
                      {passwordValidation.hasSpecialChar && <span className="text-white text-xs">✓</span>}
                    </span>
                    Al menos 1 símbolo especial (!@#$%^&*)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password field (only in register) */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-base sm:text-lg font-medium text-slate-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repite tu contraseña"
                className={`w-full px-4 py-3 border-2 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-500 text-black ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm sm:text-base mt-2">{errors.confirmPassword}</p>
              )}
              {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-green-600 text-sm sm:text-base mt-2">✓ Las contraseñas coinciden</p>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            id={isLogin ? 'login' : 'register'}
            className='w-full py-3 px-4 rounded-lg font-semibold text-lg sm:text-xl transition mt-6 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          className="cursor-pointer w-full py-3 px-4 border-2 border-slate-300 rounded-lg font-semibold text-base sm:text-lg text-slate-700 hover:bg-slate-50 transition mt-6 flex items-center justify-center gap-2"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          Continuar con Google
        </button>

        {/* Toggle view link */}
        <p className="text-center text-slate-600 text-base sm:text-lg mt-8">
          {isLogin ? '¿No tenés cuenta? ' : '¿Ya tenés una cuenta? '}
          <button
            type="button"
            onClick={switchView}
            className="text-blue-600 font-semibold hover:underline text-base sm:text-lg"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>

      
    </div>
  );
}
