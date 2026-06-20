'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useLogin';
import { validateEmail } from '@/lib/validations';
import { useUserStore } from '@/lib/store';
import { useTranslation } from '@/hooks/useTranslation';
import { projectsService } from '@/services/project';
import { useRequest } from '@/hooks/useRequest';

export default function Login({ onLoadingChange }) {
  const { t } = useTranslation('login');
  const router = useRouter();
  const { handleLogin, userData } = useLogin();
  const setRol = useUserStore((state) => state.setRol);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { execute: getAllProjects } = useRequest(projectsService.getAll);

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
    if (userResult.data.role === 'mentor') {
      router.push('/evaluations');
      return;
    }
    // Si el rol es emprendedor se obtienen todos los proyectos y se busca el perteneciente al usuario logueado
    if (userResult.data.role === 'entrepreneur') {
      const { data: allProjectsResponse, error: allProjectsError } =
        await getAllProjects();
      if (allProjectsError) {
        setServerError(t('errorFetchProjects'));
        setLoading(false);
        onLoadingChange?.(false);
        return;
      }
      const project = allProjectsResponse.find(
        (project) => project.owner.id === userResult.data.sub,
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-micro-label block mb-2">{t('email')}</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="text-micro-label block mb-2">{t('password')}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        {serverError && (
          <p className="text-red-500 text-sm text-center">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition 
  ${
    loading
      ? 'bg-gray-500 cursor-not-allowed'
      : 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] cursor-pointer'
  }
`}
        >
          {t('loginSubmit')}
        </button>
      </form>
    </>
  );
}
