'use client';

import { useSyncExternalStore, useEffect } from 'react';

import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { useUserStore } from '@/lib/store';

export default function DashboardLayout({ children }) {
  const authChecked = useSyncExternalStore(
    useUserStore.subscribe,
    () => useUserStore.getState().authChecked,
    () => false,
  );

  const isAuthenticated = useSyncExternalStore(
    useUserStore.subscribe,
    () => useUserStore.getState().isAuthenticated(),
    () => false,
  );

  const checkSession = useUserStore((state) => state.checkSession);

  useEffect(() => {
    if (!authChecked) {
      checkSession();
    }
  }, [authChecked, checkSession]);

  if (!authChecked) return <LoadingScreen />;

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