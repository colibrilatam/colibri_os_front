'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';

export default function LoginRegisterPage() {
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Form errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Validation rules
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Real-time validation on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

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
      if (value.trim() === '') {
        newErrors.password = 'La contraseña es requerida';
      } else if (!validatePassword(value)) {
        newErrors.password = 'La contraseña debe tener mínimo 6 caracteres';
      } else {
        newErrors.password = '';
      }
    }

    setErrors(newErrors);
  };

  // Check if form is valid
  const isFormValid = () => {
    if (view === 'login') {
      return formData.email.trim() !== '' && 
             formData.password.trim() !== '' && 
             !errors.email && 
             !errors.password;
    } else {
      return formData.username.trim() !== '' && 
             formData.email.trim() !== '' && 
             formData.password.trim() !== '' && 
             !errors.username && 
             !errors.email && 
             !errors.password;
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    setLoading(true);
    
    // Se simula una llamada a la API con un delay de 1.5 segundos
    setTimeout(() => {
      console.log(`${view === 'login' ? 'Login' : 'Registro'} iniciado:`, formData);
      setLoading(false);
    }, 1500);
  };

  // Handle Google button click
  const handleGoogleClick = () => {
    console.log('Google button clicked');
  };

  // Switch between views
  const switchView = () => {
    setView(view === 'login' ? 'register' : 'login');
    setFormData({ username: '', email: '', password: '' });
    setErrors({ username: '', email: '', password: '' });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const isLogin = view === 'login';

  return (
    <div className="flex items-center relative flex-col justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100 px-4 p-6">
        {/* Home button */}
      <Link
        href="/"
        className=" top-4 left-4 absolute  px-6 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition"
      >
        Volver al inicio
      </Link> 

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p className="text-center text-slate-500 text-sm mb-8">
          {isLogin ? 'Bienvenido de vuelta' : 'Únete a nosotros hoy'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username field (only in register) */}
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="tu_usuario"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-500 text-black ${
                  errors.username ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu_email@ejemplo.com"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-500 text-black ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 6 caracteres"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-500 text-black ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className='w-full py-2 px-4 rounded-lg font-semibold transition mt-6 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          className="w-full py-2 px-4 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition mt-4 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
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
        <p className="text-center text-slate-600 text-sm mt-6">
          {isLogin ? '¿No tenés cuenta? ' : '¿Ya tenés una cuenta? '}
          <button
            type="button"
            onClick={switchView}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? 'Registrate' : 'Iniciá sesión'}
          </button>
        </p>
      </div>

      
    </div>
  );
}
