'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import { useUserProfile } from '@/hooks/queries/useUserProfile';
import { useProjects } from '@/hooks/queries/useProjects';
import { useUserStore, useIsDemo } from '@/lib/store';

export default function ProjectLayout({ children }) {
  const router = useRouter();

  // 📡 Suscripción al estado de autenticación (igual que en ClientLayout)
  const authChecked = useSyncExternalStore(
    useUserStore.subscribe,
    () => useUserStore.getState().authChecked,
    () => false,
  );
  const isAuthenticated = useSyncExternalStore(
    useUserStore.subscribe,
    () => useUserStore.getState().isAuth(),
    () => false,
  );

  // 🔐 Hooks siempre al principio (regla de React). Los early returns vienen después.
  const user = useUserStore((state) => state.user);
  const isDemo = useIsDemo();
  const { data: projectData, isLoading: projectsLoading } = useProjects();

  // 🔄 Redirección cuando los datos estén listos
  useEffect(() => {
    if (projectsLoading) return;

    // SEC-002: antes estaba hardcodeado `const isDemo = true`. Ahora se lee del
    // store, pero isDemo solo se deriva del claim del servidor cuando el backend
    // emita role=demo_readonly (pendiente PR-BE3/PR-FE3). Hasta entonces es false
    // y el redirect se ejecuta normalmente.
    if (user?.email === 'ana@colibri.com' && isDemo) {
      return;
    }

    if (projectData) {
      const userProject = projectData.find((p) => p.ownerUserId === user?.sub);
      if (userProject) {
        router.replace(`/dashboard/${userProject.id}/about`);
      }
    }
  }, [user, projectData, projectsLoading, router, isDemo]);

  // ⏳ Esperar a que se verifique la autenticación
  if (!authChecked) {
    return <LoadingScreen />;
  }

  // 🚫 Si no está autenticado, mostrar error (aunque ClientLayout ya protege)
  if (!isAuthenticated) {
    return (
      <ErrorScreen
        error={{ message: 'Debes iniciar sesión para acceder a esta sección' }}
        next="Iniciar sesión"
        redirect="/login"
      />
    );
  }

  // ⚠️ Manejo de error al cargar el perfil
  if (!user || !projectData || projectsLoading) {
    return (
      <ErrorScreen
        error="Error al cargar el perfil o los proyectos. Por favor, inténtalo de nuevo más tarde."
        redirect="/login"
        next="Iniciar sesión"
      />
    );
  }

  return <>{children}</>;
}