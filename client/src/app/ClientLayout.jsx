'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import Header from '@/components/Header';
import MainHeader from '@/components/MainHeader';

import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';

import OnbordaWrapper from '@/lib/tutorial/layout';
import { useUserStore } from '@/lib/store';

import { getRouteConfig } from '@/lib/layoutConfig';
import ThemeLoader from '@/components/ThemeLoader';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const route = getRouteConfig(pathname);

  const isAuthenticated = useSyncExternalStore(
    useUserStore.subscribe,
    () => useUserStore.getState().isAuthenticated(),
    () => null,
  );

  const userRole = useUserStore((state) => state.rol);

  // Loading mientras hidrata Zustand
  if (route.protected && isAuthenticated === null) {
    return <LoadingScreen />;
  }

  // Usuario no autenticado
  if (route.protected && !isAuthenticated) {
    return (
      <ErrorScreen
        error={{
          message: 'Debes iniciar sesión para acceder a esta sección',
        }}
        next="Iniciar sesión"
        redirect="/login"
      />
    );
  }

  // Usuario sin permisos
  if (route.roles?.length > 0 && !route.roles.includes(userRole)) {
    return (
      <ErrorScreen
        error={{
          message: 'No tienes permisos para acceder a esta sección',
        }}
        next="Volver al inicio"
        redirect="/home"
      />
    );
  }

  return (
    <OnbordaWrapper>
      {route.header === 'main' && <MainHeader />}

      {/* {route.header === 'project' && <Header />} */}
      <ThemeLoader />
      <main className={route.padding}>{children}</main>
    </OnbordaWrapper>
  );
}
