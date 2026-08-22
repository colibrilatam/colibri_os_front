'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { userService } from '@/services/user';
import { useUserStore } from '@/lib/store';

export default function GoogleCallback() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setRol = useUserStore((state) => state.setRol);
  const { t } = useTranslation('login');

  useEffect(() => {
    // El backend ya seteó la cookie httpOnly antes de redirigir aquí.
    // Verificamos la sesión llamando al perfil.
    userService.profile()
      .then((userData) => {
        setUser(userData);
        setRol(userData.role);
        router.replace('/');
      })
      .catch(() => {
        router.replace('/login?error=google_failed');
      });
  }, [router, setUser, setRol]);

  return <p>{t('loggingIn')}</p>
}
