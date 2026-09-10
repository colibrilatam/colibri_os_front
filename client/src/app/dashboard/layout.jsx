'use client';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { useUserStore } from '@/lib/store';

export default function DashboardLayout({ children }) {
  // 1. Estado para saber si el componente ya se hidrató en el cliente
  const [isHydrated, setIsHydrated] = useState(false);

  // 2. Suscripción normal de Zustand (ya usa useSyncExternalStore internamente de forma segura)
  // Nota: Si 'isAuthenticated' es una función en tu store, usa: state.isAuthenticated()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // 3. Efecto que se ejecuta solo en el cliente después del primer renderizado
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 4. Mientras se hidrata, mostramos una pantalla de carga (evita el mismatch de SSR)
  if (!isHydrated) {
    return <LoadingScreen />;
  }

  // 5. Si ya se hidrató y no está autenticado, mostramos el error
  if (!isAuthenticated) {
    return (
      <ErrorScreen
        error={{ message: "Debes iniciar sesión para acceder a esta sección" }}
        next={"Iniciar sesión"}
        redirect={"/login"}
      />
    );
  }

  // 6. Si está autenticado, renderizamos el contenido
  return <>{children}</>;
}