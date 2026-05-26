'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';


export default function DashboardLayout({ children }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated()) {
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
