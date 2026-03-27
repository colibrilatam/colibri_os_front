'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';



export default function Header({ sidebarOpen, setSidebarOpen }) {
  const { token, logout } = useUserStore();
  const rol = useUserStore((state) => state.rol);
  const setRol = useUserStore((state) => state.setRol);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center" >
      <div className="flex items-center gap-4">
        {/* Botón Hamburguesa */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors"
          title={sidebarOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
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
        <h1 className="text-2xl font-bold text-gray-800">R-Lab</h1>
      </div>

<div className='flex flex-row gap-4'>
  {!token ? (
    <a
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Iniciar sesión
      </a>
  ) : (
    <button
      onClick={() => handleLogout()}
      className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Cerrar sesión
    </button>
  )}
      

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {rol} ▼
        </button>

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
