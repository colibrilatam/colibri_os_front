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
  const setSidebarMobileOpen = useUserStore(
    (state) => state.setSidebarMobileOpen,
  );

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
      <button
        onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
        className="absolute z-50  top-0 left-2 cursor-pointer rounded-2xl px-2 bg-gray-900 hover:bg-gray-800 flex items-center h-fit justify-center transition-colors lg:hidden"
        title={sidebarMobileOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
      >
        <svg
          className="w-12 h-14 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Header - siempre deja espacio al sidebar contraído */}
      <header className="lg:ml-24">
        <Header />
      </header>

      <div className="flex flex-1">
        {/* Contenido - siempre deja espacio al sidebar contraído */}
        {/* <main className="text-black flex-1 p-4 lg:ml-24 w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </main> */}
      </div>
    </div>
  );
}
