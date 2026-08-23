'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/useRegister';
import { useTranslation } from '@/hooks/useTranslation';
import { useLogin } from '@/hooks';
import { useEffect, useState, useMemo } from 'react';
import { useUserStore } from '@/lib/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

// Clave para guardar datos en localStorage (opcional)
const STORAGE_KEY = 'register_form_backup';

export default function Register({ selectedRole, onSuccess, onBack, onLoadingChange }) {
  const { t } = useTranslation('login');
  const { handleRegister } = useRegister();

  const registerSchema = useMemo(() => z
    .object({
      fullName: z.string().min(1, t('errorRequiredName')),
      email: z.string().min(1, t('errorRequiredEmail')).email(t('errorInvalidEmail')),
      password: z
        .string()
        .min(1, t('errorRequiredPassword'))
        .min(8, t('errorPasswordLength'))
        .regex(/[A-Z]/, t('errorPasswordUppercase'))
        .regex(/[0-9]/, t('errorPasswordNumber'))
        .regex(/[!@#$%^&*(),.?":{}|<>]/, t('errorPasswordSpecial')),
      confirmPassword: z.string().min(1, t('errorRequiredConfirmPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('errorPasswordsNotMatch'),
      path: ['confirmPassword'],
    }), [t]);

    
  const isDemo = useUserStore((state) => state.isDemo);
  const setIsDemo = useUserStore((state) => state.setIsDemo);
  const setToken = useUserStore((state) => state.setToken);
  const setRol = useUserStore((state) => state.setRol);
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
        if(value.password || value.confirmPassword) return; // No guardar si hay contraseña para evitar riesgos de seguridad
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
    setToken(null);
    const result = await handleRegister({ ...data});

    if (result.success) {
      setRol(selectedRole);
      sessionStorage.removeItem(STORAGE_KEY);
      setToken(result.data.token);
      onSuccess();
    } else {
      const errorMessage = result.error?.message || result.error || t('errorUnknown');
      const createError = `${t('errorCreateUser')} ${errorMessage}`;
      setError('root', { type: 'manual', message: createError });
      setGeneralError(createError);
      alert(createError)
    }
  } catch (error) {
    console.error(error);
    setError('root', { 
      type: 'manual', 
      message: t('errorConnection')
    });
    setGeneralError(t('errorConnection'));
    alert(t('errorConnection'))
  } finally {
    onLoadingChange(false);
  }
};

  const onSubmitDemo = async (e) => {
    e.preventDefault();
    setToken(null);
    const result = await handleDemoLogin(selectedRole);
    if (result?.success !== false) {
      onSuccess();
    }
  };

  const onSubmit = isDemo ? onSubmitDemo : handleSubmit(onSubmitReal);

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Nombre completo */}
      <Input
        label={t('fullName')}
        {...register('fullName')}
        error={errors.fullName?.message}
      />

      {/* Email */}
      <Input
        label={t('email')}
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      {/* Contraseña */}
      <Input
        label={t('password')}
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />

      {/* Lista de requisitos */}
      <div className="space-y-2 mt-2 mb-4 bg-white/5 p-3 rounded-lg">
        <p className="text-sm text-gray-300 mb-2">{t('passwordRequirements')}</p>
        <ul className="space-y-1 text-sm">
          <li className={`flex items-center gap-2 ${requirements.minLength ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.minLength ? '✅' : '○'} {t('reqMinLength')}
          </li>
          <li className={`flex items-center gap-2 ${requirements.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.hasNumber ? '✅' : '○'} {t('reqNumber')}
          </li>
          <li className={`flex items-center gap-2 ${requirements.hasUppercase ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.hasUppercase ? '✅' : '○'} {t('reqUppercase')}
          </li>
          <li className={`flex items-center gap-2 ${requirements.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}`}>
            {requirements.hasSpecialChar ? '✅' : '○'} {t('reqSpecialChar')}
          </li>
        </ul>
      </div>

      {/* Confirmar contraseña */}
      <Input
        label={t('confirmPassword')}
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      {/* Error general */}
      {errors.root && <p className="text-red-500 text-sm mt-2">{errors.root.message}</p>}
      {generalError.length > 0 && <p className="text-red-500 text-sm mt-2">{generalError}</p>}

      {/* Botón registro */}
      <Button
        type="submit"
        variant="action"
        fullWidth
        disabled={(!isDemo && !isValid) || isSubmitting}
      >
        {isSubmitting ? t('registering') : t('registerSubmit')}
      </Button>

      {!isDemo && !isValid && !isSubmitting && (
  <p className="text-yellow-400 text-sm">{t('registerHint')}</p>
)}

      {/* Botón volver */}
      <Button
        variant="secondary-full"
        fullWidth
        onClick={onBack}
      >
        {t('backAlt')}
      </Button>
    </form>
  );
}