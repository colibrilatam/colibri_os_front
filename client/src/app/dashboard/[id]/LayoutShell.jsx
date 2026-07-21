'use client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

import { ProjectContext } from '@/lib/projectContext';
import mockProjectDataT4 from '@/lib/mock/proyectos ficticios/flujoClaveT4.json';
import tramoMockData from '@/lib/mock/proyectos ficticios/tramo4/tramo.json';
import allTramosMockData from '@/lib/mock/proyectos ficticios/tramo4/allTramosProject.json';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import ThemeLoader from '@/components/ThemeLoader';
import { useOnborda } from 'onborda';
import Footer from '@/components/Footer';
import { useTranslatedObject } from '@/hooks/useTranslatedObject';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { useUserStore } from '@/lib/store';

export default function LayoutShell({ children, projectInfo }) {
  const pathname = usePathname();

  const showFooter =
    pathname.startsWith('/dashboard') || pathname.startsWith('/user');

  const hideHeader = pathname.includes('/about');

  const capaActual = pathname.split('/').pop();

  const { startOnborda, closeOnborda } = useOnborda();

  useEffect(() => {
    closeOnborda(); // limpiá el estado anterior

    const key = `tutorial_seen_${capaActual}`;
    const seen = localStorage.getItem(key);

    if (!seen) {
      localStorage.setItem(key, 'true');
      setTimeout(() => startOnborda(capaActual), 500); // pequeño delay para que el DOM esté listo
    }
  }, [capaActual]); // se ejecuta cada vez que cambia la ruta

  const subioTramo = useUserStore((state) => state.subioTramo);

  if (subioTramo && projectInfo.dbProject.projectName === 'FlujoClave') {
    projectInfo = {
      ...projectInfo,
      mockProject: mockProjectDataT4,
      tramoData: tramoMockData,
      projectTramoData: allTramosMockData,
    };
  }

  // estado del sidebar
  const sidebarDesktopExpanded = useUserStore(
    (state) => state.sidebarMobileOpen,
  );
  const setSidebarMobileOpen = useUserStore(
    (state) => state.setSidebarMobileOpen,
  );

  const language = useUserStore((state) => state.language);

  const translatedContent =
  useTranslatedContent(
    projectInfo.translatableContent,
  );
  return (
    <ProjectContext.Provider
      value={{
        ...projectInfo,
        translatedContent,
      }}
    >
      <ThemeLoader></ThemeLoader>
      <div className=" lg:pt-0 min-h-screen flex flex-col w-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarDesktopExpanded}
          onClose={() => setSidebarMobileOpen(false)}
        />

        {/* Header - siempre deja espacio al sidebar contraído */}
        {!hideHeader && (
          <div className="fixed lg:pl-24 lg:pr-6 z-48 p-1 w-svw">
            <Header />
          </div>
        )}
        {!sidebarDesktopExpanded && (
          <button
            onClick={() => setSidebarMobileOpen(!sidebarDesktopExpanded)}
            className="fixed z-50 md:top-34 top-42 left-2 cursor-pointer rounded-2xl px-2 bg-gray-900 hover:bg-gray-800 flex items-center h-fit justify-center transition-colors lg:hidden"
            title={sidebarDesktopExpanded ? 'Cerrar sidebar' : 'Abrir sidebar'}
          >
            <svg
              className="w-12 h-12 text-white"
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
        )}

        <div
          className={`
    flex flex-1
    ${hideHeader ? 'mt-0' : 'mt-55 md:mt-46 xl:mt-36'}
  `}
        >
          {/* Contenido - siempre deja espacio al sidebar contraído AAAAAAAAAAA*/}
          <main className="text-black flex-1 p-1 lg:p-4 lg:pl-26 h-fit w-full max-w-[100vw] overflow-hidden">
            {children}
          </main>
        </div>
        {showFooter && <Footer />}
      </div>
    </ProjectContext.Provider>
  );
}
