'use client';
import { useState } from 'react';
import { useRegister } from '@/hooks/useRegister';
import { validatePassword, getPasswordErrors, validateEmail } from '@/lib/validations';

export default function Register({ selectedRole, onSuccess, onBack, onLoadingChange }) {
  const { handleRegister } = useRegister();

  // DEMO
  const isDemo = true;

  const [formData, setFormData] = useState({
    username: 'demoUser',
    email: 'demoemail@demo.com',
    password: 'Password1425!',
    confirmPassword: 'Password1425!',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // validación de contraseña
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  });

  // input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    if (name === 'username') {
      newErrors.username = value.trim() === '' ? 'El nombre de usuario es requerido' : '';
    }

    if (name === 'email') {
      if (value.trim() === '') newErrors.email = 'El email es requerido';
      else if (!validateEmail(value)) newErrors.email = 'El email no tiene un formato válido';
      else newErrors.email = '';
    }

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);

      if (value.trim() === '') newErrors.password = 'La contraseña es requerida';
      else if (!validation.isValid) newErrors.password = getPasswordErrors(validation).join(', ');
      else newErrors.password = '';

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      } else if (formData.confirmPassword === value) {
        newErrors.confirmPassword = '';
      }
    }

    if (name === 'confirmPassword') {
      if (value.trim() === '') newErrors.confirmPassword = 'Confirmar contraseña es requerido';
      else if (value !== formData.password) newErrors.confirmPassword = 'Las contraseñas no coinciden';
      else newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
  };

  // validación de formulario
  const isFormValid = () =>
    formData.username &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !errors.username &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    passwordValidation.isValid;

    const handleSubmitDemo = (e) => {
      e.preventDefault();
      alert("Demostración de registro");
      onSuccess();
    }

    // enviar formulario
  const handleSubmit = async (e) => {
    if(isDemo) {
      alert("Demostración de registro");
      return onSuccess();
      
    }
    e.preventDefault();
    const validation = await validatePassword(formData.password);
     setPasswordValidation(validation);

    if (!isFormValid()) {
      return alert('Por favor, corrige los errores en el formulario antes de continuar.');
    }

    onLoadingChange(true);
    const result = await handleRegister({ ...formData, role: selectedRole });
    onLoadingChange(false);

    if (result.success) {
      alert('¡Te has registrado correctamente! Bienvenido a Colibri OS');
      onSuccess();
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={isDemo ? handleSubmitDemo : handleSubmit} className="space-y-5">
      <div>
        <label className="text-micro-label block mb-2">Nombre completo</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
            errors.username ? 'border-red-500' : ''
          }`}
        />
      </div>

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

      <div>
        <label className="text-micro-label block mb-2">Confirmar contraseña</label>
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

      <button
        type="submit"
        className={`w-full py-3 rounded-lg font-semibold transitionbg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer bg-gray-500`}
      >
        Registrarse
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
      >
        Volver atrás
      </button>
    </form>
  );
}
