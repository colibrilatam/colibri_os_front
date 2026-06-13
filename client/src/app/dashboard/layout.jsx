'use client';

import { useSyncExternalStore } from 'react';
import { useUserStore } from '@/lib/store';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';

export default function DashboardLayout({ children }) {
  const isAuthenticated = useSyncExternalStore(
    useUserStore.subscribe,
    () => useUserStore.getState().isAuthenticated(),  // cliente
    () => null,                                        // servidor → null = "no sé todavía"
  );

  if (isAuthenticated === null) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <ErrorScreen
        error={{ message: "Debes iniciar sesión para acceder a esta sección" }}
        next={"Iniciar sesión"}
        redirect={"/login"}
      />
    );
  }

  return <>{children}</>;
}