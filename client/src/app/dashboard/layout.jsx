'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';


export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [ error, setError ] = useState(null);
 


  useEffect(() => {
    // Verificar autenticación
    setIsLoading(true);
    if (!isAuthenticated()) {
      setError("Debes iniciar sesión para acceder a esta sección")
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if(error) {
    return <ErrorScreen error={{message: error}} next={"Iniciar sesión"} redirect={"/login"} />;
  }
 

  return (
    <>
      {children}
    </>
  );
}
