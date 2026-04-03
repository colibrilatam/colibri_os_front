'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useUserStore } from '@/lib/store';
import LoadingScreen from '@/components/LoadingScreen';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const sidebarMobileOpen = useUserStore((state) => state.sidebarMobileOpen);
  const setSidebarMobileOpen = useUserStore((state) => state.setSidebarMobileOpen);

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarMobileOpen} 
        onClose={() => setSidebarMobileOpen(false)} 
      />

      {/* Header - siempre deja espacio al sidebar contraído */}
      <header className="lg:ml-24">
        <Header />
      </header>

      <div className="flex flex-1">
        {/* Contenido - siempre deja espacio al sidebar contraído */}
        <main className="text-black flex-1 p-6  lg:ml-24">
          {children}
        </main>
      </div>
    </div>
  );
}