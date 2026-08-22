'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useUserStore } from '@/lib/store';
import { userService } from '@/services/user';

export default function GoogleCallback() {
  const router = useRouter();
  const setRol = useUserStore((state) => state.setRol);
  const setUser = useUserStore((state) => state.setUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        // El backend ya seteó la cookie httpOnly 'colibri_access_token'
        // y redirigió aquí sin tokens en la URL. La cookie se envía
        // automáticamente con esta petición.
        const userData = await userService.profile();
        if (userData) {
          setUser(userData);
          setRol(userData.role);
          router.replace('/');
        } else {
          setError('No se pudo obtener el perfil');
          setTimeout(() => router.replace('/login?error=google_failed'), 2000);
        }
      } catch (err) {
        console.error('Error loading profile after Google OAuth:', err);
        setError('Error de autenticación');
        setTimeout(() => router.replace('/login?error=google_failed'), 2000);
      }
    }

    loadProfile();
  }, []);

  const { t } = useTranslation('login');

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return <p>{t('loggingIn')}</p>;
}