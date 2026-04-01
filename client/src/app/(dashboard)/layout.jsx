'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useUserStore } from '@/lib/store';

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const sidebarMobileOpen = useUserStore((state) => state.sidebarMobileOpen)
  const setSidebarMobileOpen = useUserStore((state) => state.setSidebarMobileOpen)

  /*// Verificar autenticación al montar el componente
  useEffect(() => {
    if (!isAuthenticated()) router.push('/login')
  }, [])

  if (!isAuthenticated()) return null
  */
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
        <main className="text-black flex-1 p-6 bg-gray-100 lg:ml-24">
          {children}
        </main>
      </div>
    </div>
  );
}