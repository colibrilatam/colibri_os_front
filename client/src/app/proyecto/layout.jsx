'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import { useUserProfile } from '@/hooks/queries/useUserProfile';
import { useProjects } from '@/hooks/queries/useProjects';
import { useUserStore } from '@/lib/store';

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

  // 🔐 Ahora sí, el usuario está autenticado, cargamos datos
  const user = useUserStore((state) => state.user);

  const { data: projectData, isLoading: projectsLoading } = useProjects();

  // 🔄 Redirección cuando los datos estén listos
  useEffect(() => {
    if (userLoading || projectsLoading) return;

    // DEMO
    const isDemo = true;

    if (user?.email === 'ana@colibri.com' && isDemo) {
      return;
    }

    if (projectData) {
      const userProject = projectData.find((p) => p.ownerUserId === user?.sub);
      if (userProject) {
        router.replace(`/dashboard/${userProject.id}/about`);
      }
    }
  }, [user, userLoading, projectData, projectsLoading, router]);

  // ⚠️ Manejo de error al cargar el perfil
  if (!user || !projectData || projectsLoading) {
    return (
      <ErrorScreen
        error={userError}
        redirect="/login"
        next="Iniciar sesión"
      />
    );
  }

  return <>{children}</>;
}