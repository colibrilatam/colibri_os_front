'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore, Suspense, lazy, useState } from 'react';

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

  const checkAuth = useUserStore((state) => state.checkAuth);
  const userRole = useUserStore((state) => state.rol);

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

  // Se dispara UNA vez (y de nuevo solo si authChecked vuelve a false, p. ej. tras logout)
  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked, checkAuth]);
  // Mientras no sepamos si está logueado, mostramos loading (solo en rutas protegidas)
  if (route.protected && !authChecked) {
    return <LoadingScreen />;
  }

  if (route.protected && !isAuthenticated) {
    return (
      <ErrorScreen
        error={{ message: 'Debes iniciar sesión para acceder a esta sección' }}
        next="Iniciar sesión"
        redirect="/login"
      />
    );
  }

  if (route.roles?.length > 0 && !route.roles.includes(userRole)) {
    return (
      <ErrorScreen
        error={{ message: 'No tienes permisos para acceder a esta sección' }}
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