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

function redirectByRole(router, role) {
  if (role === 'entrepreneur') router.replace('/proyecto');
  else if (role === 'mecenas_semilla') router.replace('/user/nft');
  else if (role === 'evaluator' || role === 'mentor') router.replace('/evaluations');
  else router.replace('/home');
}

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation('login');

  const setUser = useUserStore((s) => s.setUser);
  const setRol = useUserStore((s) => s.setRol);

  const [profileCompletionToken, setProfileCompletionToken] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = searchParams.get('code');

    // Limpieza inmediata de la URL, ANTES de cualquier llamada async.
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (!code) {
      router.replace('/login?error=google_failed');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await authService.exchangeGoogleCode(code);
        console.log(data, 'data')
        if (cancelled) return;

        if (data.requiresProfileCompletion) {
          // Token SOLO en memoria; nunca en storage, store, ni cookies.
          setProfileCompletionToken(data.profileCompletionToken);
          return;
        }

        setUser(data.user);
        setRol(data.user.role);
        redirectByRole(router, data.user.role);
      } catch(err) {
        console.error(err);
        if (cancelled) return;
        router.replace('/login?error=google_failed');
      }
    })();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole || !selectedGender) {
      setError('Por favor selecciona tu rol y género.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await authService.completeProfile({
        profileCompletionToken,
        role: selectedRole,
        gender: selectedGender,
      });

      setProfileCompletionToken(null); // limpiar de memoria

      setUser(data.user);
      setRol(data.user.role);
      redirectByRole(router, selectedRole);
    } catch (err) {
      setError(err?.message || 'Error al completar perfil. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (profileCompletionToken) {
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
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--action-primary)]"
                required
                disabled={loading}
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
              <SelectRole onSelectRole={setSelectedRole} />
            </div>
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
              {loading ? 'Completando...' : 'Continuar'}
            </button>
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