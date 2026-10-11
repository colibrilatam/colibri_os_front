'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
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

  // 🔐 Hooks siempre al principio (regla de React). Los early returns vienen después.
  const user = useUserStore((state) => state.user);
  const {
    data: projectData,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjects();

  // El usuario solo puede tener un proyecto propio (ownerUserId === user.id).
  const userProject = projectData?.find((p) => p.ownerUserId === user?.id);
  console.log('userProject', userProject, projectData, user);

  // 🔄 Redirección cuando los datos estén listos
  useEffect(() => {
    if (userProject) {
      router.replace(`/dashboard/${userProject.id}/about`);
    }
  }, [userProject, router]);

  // ⏳ Esperar a que se verifique la autenticación y carguen los proyectos
  if (!authChecked || projectsLoading) {
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

  // ⚠️ Manejo de error al cargar el perfil o los proyectos
  if (projectsError || !user) {
    return (
      <ErrorScreen
        error="Error al cargar el perfil o los proyectos. Por favor, inténtalo de nuevo más tarde."
        redirect="/login"
        next="Iniciar sesión"
      />
    );
  }

  // ⏳ Redirección en curso: no renderizar el formulario de creación
  if (userProject) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}