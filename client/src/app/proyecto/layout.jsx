'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ErrorScreen from '@/components/ErrorScreen';
import { useUserProfile } from '@/hooks/queries/useUserProfile';
import { useProjects } from '@/hooks/queries/useProjects';

export default function ProjectLayout({ children }) {
  const router = useRouter();

  const { data: user, isLoading: userLoading, error: userError } = useUserProfile();
  const { data: projectData, isLoading: projectsLoading } = useProjects();

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

  if (userError) {
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
