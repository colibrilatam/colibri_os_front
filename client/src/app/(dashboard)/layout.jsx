'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useUserStore } from '@/lib/store';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  // Verificar autenticación al montar el componente
  useEffect(() => {
    if (!isAuthenticated()) router.push('/login')
  }, [])

  if (!isAuthenticated()) return null
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebarOpen && <Sidebar />}

        {/* Contenido */}
        <main className="text-black flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}