'use client';
import NftAvatar from './señal/NftAvatar';
import { useState } from 'react';
import Link from "next/link";
import {useEffect} from 'react'

// contexto
import { formatDateSafe } from '@/lib/hooks/date';
import { useProject } from '@/lib/projectContext';
import { useUserStore } from '@/lib/store';

import { projectStatus } from '@/lib/types/projectStatus';
import { useRouter } from 'next/navigation';

export default function Header({ isHome = false }) {

  const [ auth, setAuth ] = useState(false);

  useEffect(() => {
    setAuth(isAuthenticated());
  },[])

  const {isAuthenticated , logout} = useUserStore();
  const router = useRouter();


  if (isHome) {
    return (
      <header className=" lg:m-2  border-glass rounded-2xl glass-effect-dark px-4 py-2 flex justify-around  min-h-16 lg:min-h-auto content-center items-center" >
        <div className=" flex items-center gap-0 lg:items-center justify-between lg:gap-4 content-center  w-full ">


          <div className="flex items-center justify-between px-4 w-full">
            <div onClick={() => router.push("/home")} className="cursor-pointer flex items-center gap-4">
              <img src="/colibri-logo.png" alt="Colibrí Logo" className="rounded-full h-16 w-16" />
              <span className="text-lg font-bold text-slate-50">Colibrí OS</span>
            </div>
            {/* Menú desplegable */}
            {auth ? (
              <div className="dropdown-container mr-20 text-(--text-primary) text-md font-bold border-blue-800 ">
                <button className="dropdown-button bg-linear-to-r from-cyan-500 to-blue-500 overflow-hidden">Mi cuenta &nbsp; ▼</button>
                <div className="border border-cyan-500 dropdown-content ">
                  <a id="top" href="#">Mi proyecto</a>
                  <a id="middle" href="/user/nft">NFTs</a>
                  <a id="bottom" className='bg-red-800' onClick={logout}  href="/login">Cerrar sesión</a>
                </div>
              </div>
            ) : (
              <div>
                <Link className="hover:text-gray-200" href="/login">
                  <button className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:text-gray-200 shadow-cyan-500/20 transition-all duration-150 cursor-pointer  hover:opacity-90 active:scale-95"
                  >
                    Ingresar
                  </button>
                </Link>
              </div>
            )}


          </div>
        </div>
      </header>
    )
  }

  // contexto // LOGIN, SEED, un proyecto completo para seed, las contraseñas de los usuarios. 
  const { tramoData, dbProject, projectNftData, projectTramoData, mockProject } = useProject();
  const { project, currentState, reputationSnapshot } = mockProject;




  return (
    <header className=" lg:m-2  border-glass rounded-2xl glass-effect-dark px-4 py-2 flex justify-between  min-h-16 lg:min-h-auto content-center items-center" >
      <div className=" flex items-center gap-0 lg:items-center lg:gap-4 content-center  w-full ">

        {isHome && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img src="/colibri-icon.png" alt="Colibrí Logo" className="h-6 w-6" />
              <span className="text-sm font-semibold text-slate-50">Colibrí OS</span>
            </div>
            <div>
              <button className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-150 hover:opacity-90 active:scale-95"
              >Acceder</button>
            </div>
          </div>
        )}
        {/* Botón Hamburguesa */}

        <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-start md:items-center justify-around w-full px-2 lg:px-10">
          {/* Sección izquierda: Nombre, ID, Tramo, Estado */}
          <div className="min-w-0 flex-1 flex flex-col gap-2 md:gap-3 items-start justify-start w-fit">
            <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 sm:gap-y-2">
              <NftAvatar size="sm" rounded={true} />
              <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-slate-50">
                {dbProject.projectName}
              </h1>

            </div>

            <div className="hidden mt-2 md:mt-3 lg:flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
              {/*  <span className="rounded-full border border-slate-700 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-slate-300">
                  ID {project.id}
                </span> */}
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1">
                {tramoData.code} - {tramoData.name}
              </span>
              <span className="rounded-full border border-emerald-800/60 bg-emerald-950/60 px-2 sm:px-3 py-0.5 sm:py-1 text-emerald-300">
                {projectStatus[dbProject.status]}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1">
                {dbProject.industry}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1">
                {dbProject.country}
              </span>
            </div>
          </div>

          {/* Sección derecha: Índice Colibrí y Última actualización */}
          <div className="md:max-w-5/12 lg:max-w-2/5 grid gap-2 md:gap-3 grid-cols-2 w-full md:w-auto md:flex-shrink-0">

            <div className="w-fit rounded-2xl border border-slate-800 bg-slate-950/60 px-3 md:px-4 py-2 md:py-3">
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Índice Colibrí
              </div>
              <div className="mt-1 flex items-end gap-2">
                <div className="text-lg md:text-2xl font-semibold text-slate-50">
                  {reputationSnapshot.icPublic.toFixed(2)}
                </div>
                <div className="pb-0.5 text-xs md:text-sm text-slate-400">
                  / 6.00
                </div>
              </div>
            </div>

            <div className="w-fit rounded-2xl border border-slate-800 bg-slate-950/60 px-3 md:px-4 py-2 md:py-3 text-right md:text-right">
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Última actualización
              </div>
              <div className="mt-1 text-sm md:text-base text-slate-200">{formatDateSafe(reputationSnapshot.calculatedAt)}</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
