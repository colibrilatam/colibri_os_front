'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function Header() {
  const { token, isGuest, logout } = useUserStore();
  const rol = useUserStore((state) => state.rol);
  const setRol = useUserStore((state) => state.setRol);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const sidebarMobileOpen = useUserStore((state) => state.sidebarMobileOpen);
  const setSidebarMobileOpen = useUserStore((state) => state.setSidebarMobileOpen);

  const roles = ['CEO', 'Colaborador', 'Mecenas', 'Visitante'];

  const handleRolChange = (newRol) => {
    setRol(newRol);
    setIsOpen(false);
  };
  function handleLogout() {
    logout();
    router.push('/login')
  }

  return (
    <header  className="border-bottom  glass-effect-dark  px-6 py-4 flex justify-between items-center z-40 relative" >
      <div className="flex items-center gap-4">
        {/* Botón Hamburguesa */}
        <button
          onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
          className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors lg:hidden"
          title={sidebarMobileOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
        >
          <svg
            className="w-6 h-6 text-white"
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
        <h1 className="text-2xl font-bold">R-Lab</h1>
      </div>

<div className='flex flex-row gap-4'>
  {(!token&&!isGuest) ? (
    <Button content="Iniciar sesión" onClick={() => router.push('/login')} color='blue'/>      
  ) : (
    <Button content="Cerrar sesión" onClick={handleLogout} color="red"/>
  )}
      

      <div className="relative">
       
        <Button onClick={() => setIsOpen(!isOpen)} color="white" content={`${rol ? rol : 'Rol'} ▼`}></Button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => handleRolChange(r)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                  r === rol ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
      </div>
    </header>
  );
}
