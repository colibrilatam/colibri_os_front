'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useLogin';
import { validateEmail } from '@/lib/validations';

export default function Login({ onLoadingChange }) {
  const router = useRouter();
  const { handleLogin } = useLogin();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  // handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    if (name === 'email') {
      if (value.trim() === '') newErrors.email = 'El email es requerido';
      else if (!validateEmail(value)) newErrors.email = 'El email no tiene un formato válido';
      else newErrors.email = '';
    }

    if (name === 'password') {
      newErrors.password = value.trim() === '' ? 'La contraseña es requerida' : '';
    }

    setErrors(newErrors);
  };

  // validación de formulario
  const isFormValid = () =>
    formData.email && formData.password && !errors.email && !errors.password;

  // enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    onLoadingChange(true);
    const result = await handleLogin(formData);
    onLoadingChange(false);

    if (result.success) {
      alert('¡Has iniciado sesión correctamente! Bienvenido a Colibri OS');
      router.push('/home');
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <button
        type="submit"
        disabled={!isFormValid()}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isFormValid()
            ? 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer'
            : 'bg-gray-500 cursor-not-allowed opacity-60'
        }`}
      >
        Iniciar sesión
      </button>
    </form>
  );
}
