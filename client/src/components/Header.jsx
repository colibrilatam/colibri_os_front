'use client';
import NftAvatar from './señal/NftAvatar';
import { useState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';

// contexto
import { formatDateSafe } from '@/lib/hooks/date';
import { useProject } from '@/lib/projectContext';

// import { projectStatus } from '@/lib/types/projectStatus';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProjectIC } from '@/lib/hooks/createIcMap';
import LanguageSwitcher from './common/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/lib/store';

export default function Header({ isHome = false }) {
  const [auth, setAuth] = useState(false);
const { t } = useTranslation('header');
  const contextData = useProject();

  const { isAuthenticated, logout, rol, subioTramo, user } = useUserStore();
  const logoSrc =
    user?.theme?.logoUrl &&
    user?.role === 'mecenas_semilla' &&
    user.theme.logoUrl;
  //console.log(user);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  const router = useRouter();

  if (isHome) {
    return (
      <header className="z-48 lg:m-2  border-glass lg:rounded-2xl glass-effect lg:px-4 lg:py-2 p-1 flex justify-around  min-h-16 lg:min-h-auto content-center items-center">
        <div className=" flex items-center gap-0 lg:items-center justify-between lg:gap-4 content-center  w-full ">
          <div className="flex items-center justify-between px-4 w-full">
            <div
              onClick={() => router.push('/home')}
              className="cursor-pointer flex items-center gap-4"
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={t('altLogo')}
                  className="h-20 w-44 object-contain"
                ></img>
              ) : (
                <>
                  <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      src="/Imagotipo Colibri OS.svg"
                      alt={t('altLogo')}
                      className="h-11 w-11 object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold text-(--text-primary)">
                    {t('colibriOs')}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-row gap-10">
            {/* Menú desplegable */}
            {auth ? (
              <div className="flex gap-4">
                {rol === 'mecenas_semilla' && (
                  <Link className="hover:text-gray-200" href="/user/nft">
                    <button className="rounded-xl bg-linear-to-r primary-button px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:text-gray-200 transition-all duration-150 cursor-pointer  hover:opacity-90 active:scale-95">
                      {t('nfts')}
                    </button>
                  </Link>
                )}
                <Link className="hover:text-gray-200" href="/login">
                  <button
                    onClick={() => logout()}
                    className="rounded-xl bg-linear-to-r from-red-600 to-red-800 p-2 lg:px-5 lg:py-2.5 text-sm font-semibold text-white shadow-lg hover:text-gray-200 shadow-red-500/20 transition-all duration-150 cursor-pointer  hover:opacity-90 active:scale-95"
                  >
                   {t('logout')}
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <Link className="hover:text-gray-200" href="/login">
                  <button className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:text-gray-200 shadow-cyan-500/20 transition-all duration-150 cursor-pointer  hover:opacity-90 active:scale-95">
                   {t('login')}
                  </button>
                </Link>
              </div>
            )}
            <LanguageSwitcher></LanguageSwitcher>
           </div>
          </div>
        </div>
      </header>
    );
  }

  // contexto // LOGIN, SEED, un proyecto completo para seed, las contraseñas de los usuarios.

  const {
    tramoData,
    dbProject,
    projectNftData,
    projectTramoData,
    mockProject,
  } = contextData;

  if (mockProject !== null) {
    const { project, currentState, reputationSnapshot } = mockProject;
  }

  //console.log("Header - dbProject:", dbProject);

  //console.log(dbProject);

  return (
    <header className=" lg:m-2  border-glass rounded-2xl glass-effect px-4 py-2 flex justify-between  min-h-16 lg:min-h-auto content-center items-center">
      <div className=" flex items-center gap-0 lg:items-center lg:gap-4 content-center  w-full ">
        {isHome && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img
                src="/colibri-icon.png"
                alt={t('altLogo')}
                className="h-6 w-6"
              />
              <span className="text-sm font-semibold text-slate-50">
                {t('colibriOs')}
              </span>
            </div>
            <div>
              <button className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-150 hover:opacity-90 active:scale-95">
                {t('access')}
              </button>
            </div>
           
          </div>
        )}
        {/* Botón Hamburguesa */}

        <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-start md:items-center justify-around w-full px-2 lg:px-10">
          {/* Sección izquierda: Nombre, ID, Tramo, Estado */}
          <div className="min-w-0 flex-1 flex flex-col gap-2 md:gap-3 items-start justify-start w-fit">
            <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 sm:gap-y-2">
              {/* <NftAvatar size="sm" rounded={true} /> */}
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center">
                {dbProject.projectImageUrl ? (
                  <Image
                    src={dbProject.projectImageUrl}
                    alt={dbProject.projectName}
                    fill
                    className="object-cover border border-black rounded-full"
                  />
                ) : (
                  <div className="text-sm text-slate-500 p-8 rounded-full">
                    {t('noImage')}
                  </div>
                )}
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-(--text-primary)">
                {dbProject.projectName}
              </h1>
            </div>

            <div className="hidden mt-2 md:mt-3 lg:flex flex-wrap items-center gap-2 text-xs sm:text-sm text-(--text-primary)">
              {/*  <span className="rounded-full border border-slate-700 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-slate-300">
                  ID {project.id}
                </span> */}
              <span className="rounded-full border border-(--text-accent) text-(--text-accent) glass-effect-accent font-bold glass-effect-dark px-2 sm:px-3 py-0.5 sm:py-1">
                {tramoData.code} - {tramoData.name}
              </span>
              <span className="rounded-full font-bold border border-(--text-accent) glass-effect-accent px-2 sm:px-3 py-0.5 sm:py-1 text-(--text-accent)">
                {t('status' + dbProject.status.charAt(0).toUpperCase() + dbProject.status.slice(1))}
              </span>
              <span className="rounded-full border border-(--text-primary) glass-effect-dark px-2 sm:px-3 py-0.5 sm:py-1">
                {dbProject.industry}
              </span>
              <span className="rounded-full border border-(--text-primary) glass-effect-dark px-2 sm:px-3 py-0.5 sm:py-1">
                {dbProject.country}
              </span>
            </div>
          </div>

          {/* Sección derecha: Índice Colibrí y Última actualización */}
          <div className="md:max-w-5/12 lg:max-w-2/5 grid gap-2 md:gap-3 grid-cols-2 w-full md:w-auto md:flex-shrink-0">
            <div className="w-fit rounded-2xl border border-(--text-primary) glass-effect-dark px-3 md:px-4 py-2 md:py-3">
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-(--text-secondary)">
                  {t('colibriIndex')}
              </div>
              <div className="mt-1 flex items-end gap-2">
                <div className="text-lg md:text-2xl font-semibold text-(--text-primary)">
                  {subioTramo && dbProject.projectName === 'FlujoClave'
                    ? getProjectIC('FlujoClaveT4')
                    : getProjectIC(dbProject.projectName)}
                </div>
                <div className="pb-0.5 text-xs md:text-sm text-slate-400">
                  {t('scoreSuffix')}
                </div>
              </div>
            </div>

            <div className="w-fit rounded-2xl border border-(--text-primary) glass-effect-dark px-3 md:px-4 py-2 md:py-3 text-right md:text-right">
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-(--text-secondary)">
                  {t('lastUpdate')}
              </div>
              <div className="mt-1 font-bold text-sm md:text-base text-(--text-primary)">
                {dbProject.updatedAt
                  ? formatDateSafe(dbProject.updatedAt)
                  : formatDateSafe(reputationSnapshot.calculatedAt)}
              </div>
            </div>
          </div>
          <LanguageSwitcher/>
        </div>
      </div>
    </header>
  );
}
