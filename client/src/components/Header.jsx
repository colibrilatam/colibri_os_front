'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Button from './Button';
import NftAvatar from './señal/NftAvatar';
import { project } from '@/lib/mock-data';
export default function Header() {
  /*
  const { token, isGuest, logout } = useUserStore();
  const rol = useUserStore((state) => state.rol);
  const setRol = useUserStore((state) => state.setRol);
  const [isOpen, setIsOpen] = useState(false);
  
  const router = useRouter();
  */
  const sidebarMobileOpen = useUserStore((state) => state.sidebarMobileOpen);
  const setSidebarMobileOpen = useUserStore((state) => state.setSidebarMobileOpen);

  return (
    <header  className="m-4 border-glass rounded-2xl glass-effect-dark lg:px-4 pr-4 py-2 flex justify-between  z-40 relative min-h-16 lg:min-h-auto content-center items-center" >
      <div className="flex items-center gap-0 lg:items-center lg:gap-4 content-center  w-full ">
        {/* Botón Hamburguesa */}
        
        <button
          onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
          className="cursor-pointer rounded-2xl px-2 bg-gray-900 hover:bg-gray-800 flex items-center h-fit justify-center transition-colors lg:hidden"
          title={sidebarMobileOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
        >
          <svg
            className="w-12 h-32 text-white"
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
      
       
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-start md:items-center justify-around w-full px-2 lg:px-10">
            {/* Sección izquierda: Nombre, ID, Tramo, Estado */}
            <div className="min-w-0 flex-1 flex flex-col gap-2 md:gap-3 items-start justify-start w-fit">
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-x-4 gap-y-1 sm:gap-y-2">
                <NftAvatar size="sm" />
                <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-slate-50">
                  {project.name}
                </h1>
               
              </div>

              <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
                 <span className="rounded-full border border-slate-700 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-slate-300">
                  ID {project.id}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1">
                  {project.tramoCode} · {project.tramoName}
                </span>
                <span className="rounded-full border border-emerald-800/60 bg-emerald-950/60 px-2 sm:px-3 py-0.5 sm:py-1 text-emerald-300">
                  {project.status}
                </span>
              </div>
            </div>

            {/* Sección derecha: Índice Colibrí y Última actualización */}
            <div className="grid gap-2 md:gap-3 grid-cols-2 w-full md:w-auto md:flex-shrink-0">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 md:px-4 py-2 md:py-3">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Índice Colibrí
                </div>
                <div className="mt-1 flex items-end gap-2">
                  <div className="text-lg md:text-2xl font-semibold text-slate-50">
                    {project.ic.toFixed(2)}
                  </div>
                  <div className="pb-0.5 text-xs md:text-sm text-slate-400">
                    / {project.icMax.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-3 md:px-4 py-2 md:py-3 text-right md:text-right">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Última actualización
                </div>
                <div className="mt-1 text-sm md:text-base text-slate-200">{project.updatedAt}</div>
              </div>
            </div>
          </div>
        
      </div>

{/*<div className='flex flex-row gap-4'>
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
       */}
    </header>
  );
}
