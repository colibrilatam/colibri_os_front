'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header';
import { useUserStore } from '@/lib/store';

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  /*// Verificar autenticación al montar el componente
  useEffect(() => {
    if (!isAuthenticated()) router.push('/login')
  }, [])

  if (!isAuthenticated()) return null*/
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header/>

      <div className="flex flex-1">
        {/* Contenido */}
        <main className="text-black flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}