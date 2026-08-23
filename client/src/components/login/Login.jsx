'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useLogin';
import { validateEmail } from '@/lib/validations';
import { useTranslation } from '@/hooks/useTranslation';
import { useProjects } from '@/hooks/queries/useProjects';
import { useUserStore } from '@/lib/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Login({ onLoadingChange }) {
  const { t } = useTranslation('login');
  const router = useRouter();
  const { handleLogin, userData, retrying } = useLogin();
  const setToken = useUserStore((state) => state.setToken);
  const setRol = useUserStore((state) => state.setRol);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: allProjectsResponse, error: allProjectsError } = useProjects();

  // handlers
  const handleInputChange = (e) => {
    setServerError('');
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    if (name === 'email') {
      if (value.trim() === '') newErrors.email = t('errorRequiredEmail');
      else if (!validateEmail(value))
        newErrors.email = t('errorInvalidEmail');
      else newErrors.email = '';
    }

    if (name === 'password') {
      newErrors.password =
        value.trim() === '' ? t('errorRequiredPassword') : '';
    }

    setErrors(newErrors);
  };

  // validación de formulario
  const isFormValid = () =>
    formData.email && formData.password && !errors.email && !errors.password;

  // enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToken(null);
    if (!isFormValid()) {
      setServerError(t('errorFormInvalid'));
      return;
    }
    setLoading(true);
    setServerError('');

    const result = await handleLogin(formData);
    if (!result.success) {

      setServerError(result.error);
      setLoading(false);
      return;
    }

    const userResult = await userData();

    if (userResult.error) {
      setServerError(t('errorUserInfo'));
      setLoading(false);
      onLoadingChange?.(false);
      return;
    }

    setRol(userResult.data.role);
    if (userResult.data.role === 'mecenas_semilla') {
      router.push('/user/nft');
      return;
    }
    if (userResult.data.role === 'mentor' || userResult.data.role === 'evaluator') {
      router.push('/evaluations');
      return;
    }
    
    // Si el rol es emprendedor se obtienen todos los proyectos y se busca el perteneciente al usuario logueado
    if (userResult.data.role === 'entrepreneur') {
      if (allProjectsError) {
        setServerError(t('errorFetchProjects'));
        setLoading(false);
        onLoadingChange?.(false);
        return;
      }
      const project = allProjectsResponse?.find(
        (project) => project.owner?.id === userResult.data.sub,
      );

      if (project) {
        router.push(`/dashboard/${project.id}/about`);
        return;
      } else {
        router.push(`/proyecto`);
        return;
      }
    }
    router.push('/home');
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            {retrying && (
              <p className="text-white text-sm text-center max-w-xs">
                {t('retryMessage')}
              </p>
            )}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('email')}
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={loading}
          error={errors.email}
        />

        <Input
          label={t('password')}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={loading}
          error={errors.password}
        />

        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <Button
          type="submit"
          variant="action"
          fullWidth
          disabled={loading}
        >
          {t('loginSubmit')}
        </Button>
      </form>
    </>
  );
}
