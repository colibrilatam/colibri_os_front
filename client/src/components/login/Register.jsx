'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/useRegister';
import { useUserStore } from '@/lib/store';
import { useLogin } from '@/hooks';
import { useEffect, useState } from 'react';

// --- Esquema de validación (sin cambios) ---
const registerSchema = z
  .object({
    fullName: z.string().min(1, 'El nombre de usuario es requerido'),
    email: z.string().min(1, 'El email es requerido').email('El email no tiene un formato válido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'La contraseña debe tener al menos un número')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe tener al menos un carácter especial'),
    confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Clave para guardar datos en localStorage (opcional)
const STORAGE_KEY = 'register_form_backup';

export default function Register({ selectedRole, onSuccess, onBack, onLoadingChange }) {
  const { handleRegister } = useRegister();
  const isDemo = useUserStore((state) => state.isDemo);
  const setIsDemo = useUserStore((state) => state.setIsDemo);
  const setToken = useUserStore((state) => state.setToken);
  const { handleDemoLogin } = useLogin();

  const [ generalError, setGeneralError ] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    watch,
    reset,
    getValues,
    setValue,
    trigger, // ← añade esta línea
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: selectedRole,
    },
  });

 // --- Recuperar datos guardados (solo si son válidos) ---
useEffect(() => {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved && !isDemo) {
    try {
      const parsed = JSON.parse(saved);
      // Validamos los datos con Zod
      const validation = registerSchema.safeParse(parsed);
      if (validation.success) {
        // Restauramos forzando la validación en cada campo
        setValue('fullName', parsed.fullName, { shouldValidate: true });
        setValue('email', parsed.email, { shouldValidate: true });
        setValue('password', parsed.password, { shouldValidate: true });
        setValue('confirmPassword', parsed.confirmPassword, { shouldValidate: true });
        // Forzamos una validación global por si acaso
        trigger();
        console.log('✅ Formulario restaurado y validado');
      } else {
        console.warn('❌ Datos inválidos en storage, se limpian');
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }
}, [isDemo, setValue, trigger]);

// Depuración (puedes quitarlo después)
useEffect(() => {
  console.log('isValid:', isValid, 'isSubmitting:', isSubmitting);
}, [isValid, isSubmitting]);

  // --- (Opcional) Guardar en localStorage cada vez que cambian los valores ---
  useEffect(() => {
    if (!isDemo) {
      const subscription = watch((value) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isDemo]);

  // Observar contraseña para los requisitos visuales
  const passwordValue = watch('password', '');
  const requirements = {
    minLength: passwordValue.length >= 8,
    hasNumber: /[0-9]/.test(passwordValue),
    hasUppercase: /[A-Z]/.test(passwordValue),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
  };

  const onSubmitReal = async (data) => {
  try {
    onLoadingChange(true);
    const result = await handleRegister({ ...data, role: selectedRole });

    if (result.success) {
      sessionStorage.removeItem(STORAGE_KEY);
      console.log(result);
      setToken(result.data.token);
      onSuccess();
    } else {
      const errorMessage = result.error?.message || result.error || 'Error desconocido';
      setError('root', { type: 'manual', message: `Error al crear usuario: ${errorMessage}` });
      setGeneralError(`Error al crear usuario: ${errorMessage}`);
      alert(`Error al crear usuario: ${errorMessage}`)
    }
  } catch (error) {
    console.error(error);
    setError('root', { 
      type: 'manual', 
      message: 'Error de conexión. Intenta nuevamente más tarde.' 
    });
    setGeneralError('Error de conexión. Intenta nuevamente más tarde.');
    alert('Error de conexión. Intenta nuevamente más tarde.')
  } finally {
    onLoadingChange(false);
  }
};

  const onSubmitDemo = async (e) => {
    e.preventDefault();
    const result = await handleDemoLogin(selectedRole);
    if (result?.success !== false) {
      onSuccess();
    }
  };

  const onSubmit = isDemo ? onSubmitDemo : handleSubmit(onSubmitReal);

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Nombre completo */}
      <div>
        <label className="text-micro-label block mb-2">Nombre completo</label>
        <input
          {...register('fullName')}
          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
            errors.fullName ? 'border-red-500' : ''
          }`}
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="text-micro-label block mb-2">Email</label>
        <input
          type="email"
          {...register('email')}
          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
            errors.email ? 'border-red-500' : ''
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Contraseña */}
      <div>
        <label className="text-micro-label block mb-2">Contraseña</label>
        <input
          type="password"
          {...register('password')}
          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
            errors.password ? 'border-red-500' : ''
          }`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {/* Lista de requisitos */}
      <div className="space-y-2 mt-2 mb-4 bg-white/5 p-3 rounded-lg">
        <p className="text-sm text-gray-300 mb-2">La contraseña debe cumplir:</p>
        <ul className="space-y-1 text-sm">
          <li className={`flex items-center gap-2 ${requirements.minLength ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.minLength ? '✅' : '○'} Mínimo 8 caracteres
          </li>
          <li className={`flex items-center gap-2 ${requirements.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.hasNumber ? '✅' : '○'} Al menos 1 número
          </li>
          <li className={`flex items-center gap-2 ${requirements.hasUppercase ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.hasUppercase ? '✅' : '○'} Al menos 1 mayúscula
          </li>
          <li className={`flex items-center gap-2 ${requirements.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.hasSpecialChar ? '✅' : '○'} Al menos 1 carácter especial
          </li>
        </ul>
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className="text-micro-label block mb-2">Confirmar contraseña</label>
        <input
          type="password"
          {...register('confirmPassword')}
          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
            errors.confirmPassword ? 'border-red-500' : ''
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Error general */}
      {errors.root && <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>}
      {generalError.length > 0 && <p className="text-red-500 text-sm mt-2">{generalError}</p>}

      {/* Botón registro */}
      <button
        type="submit"
        disabled={(!isDemo && !isValid) || isSubmitting}
        className={`w-full py-3 rounded-lg font-semibold transition bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer ${
          (!isDemo && !isValid) || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>

      {!isDemo && !isValid && !isSubmitting && (
  <p className="text-yellow-400 text-sm">Completa todos los campos correctamente para habilitar el registro</p>
)}

      {/* Botón volver */}
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