'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore, Suspense, lazy, useState } from 'react';

import Header from '@/components/Header';
import MainHeader from '@/components/MainHeader';

import ErrorScreen from '@/components/ErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';

import OnbordaWrapper from '@/lib/tutorial/layout';

import { getRouteConfig } from '@/lib/layoutConfig';
import { useUserStore } from '@/lib/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  })),
);

const showDevtools = process.env.NODE_ENV !== 'production';


export default function ClientLayout({ children }) {
  const [queryClient] = useState(() => getQueryClient());
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
    <QueryClientProvider client={queryClient}>
      <OnbordaWrapper>
        {route.header === 'main' && <MainHeader />}

        {/* {route.header === 'project' && <Header />} */}

        <main className={route.padding}>{children}</main>
      </OnbordaWrapper>
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
