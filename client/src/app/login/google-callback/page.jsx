'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/lib/store';
import { authService } from '@/services/authService';
import SelectRole from '@/components/login/SelectRole';

const GENDERS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'non_binary', label: 'No binario' },
  { value: 'other', label: 'Otro' },
  { value: 'prefer_not_to_say', label: 'Prefiero no decir' },
];

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation('login');

  const setToken = useUserStore((state) => state.setToken);
  const setRol = useUserStore((state) => state.setRol);
  const checkAuth = useUserStore((state) => state.isAuthenticated);

  const [tempToken, setTempToken] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = searchParams.get('role');
    const temp = searchParams.get('tempToken');

    if (role) {
      window.history.replaceState({}, '', window.location.pathname);
      checkAuth().then(() => {
        router.replace(
          role === 'entrepreneur' ? '/proyecto' : role === 'mecenas_semilla' ? '/evaluations' : role === 'evaluator' ? '/evaluations' : '/home'
        );
      });
      return;
    }

    if (temp) {
      setTempToken(temp);
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    router.replace('/login?error=google_failed');
  }, []); // eslint-disable-line

  const handleRoleSelect = (role) => setSelectedRole(role);
  const handleGenderChange = (e) => setSelectedGender(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole || !selectedGender) {
      setError('Por favor selecciona tu rol y género.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = { tempToken, role: selectedRole, gender: selectedGender };
      await authService.completeProfile(data);
      setRol(selectedRole || 'entrepreneur');
      if (selectedRole === 'entrepreneur') router.replace('/proyecto');
      else if (selectedRole === 'mecenas_semilla') router.replace('/evaluations');
      else if (selectedRole === 'evaluator') router.replace('/evaluations');
      else router.replace('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al completar perfil. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (tempToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-xl">
          <h1 className="text-h1 text-center mb-2">¡Bienvenido!</h1>
          <p className="text-body--muted text-center mb-8">Completa tu perfil para continuar</p>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-white/70 mb-2">
                Género
              </label>
              <select
                id="gender"
                value={selectedGender}
                onChange={handleGenderChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)]"
                required
              >
                <option className="text-black" value="">Selecciona una opción</option>
                {GENDERS.map((g) => (
                  <option className="text-black" key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">
                Elige tu rol principal
              </label>
              <SelectRole onSelectRole={handleRoleSelect} />
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <p>{t('loggingIn')}</p>;
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <GoogleCallbackInner />
    </Suspense>
  );
}