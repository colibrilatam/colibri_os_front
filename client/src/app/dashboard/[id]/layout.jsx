"use client"
import { getProjectById } from "@/lib/mock/proyectos ficticios/getProyectById";
import { usePathname } from "next/navigation";
import { createContext } from "react";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

// contexto
export const ProjectContext = createContext();

export default function DataLayout({ children }) {

  // estado del sidebar
    const sidebarMobileOpen = useUserStore((state) => state.sidebarMobileOpen);
    const setSidebarMobileOpen = useUserStore(
      (state) => state.setSidebarMobileOpen,
    );
    const router = useRouter();

// obtencion del id por parametro 
  const pathname = usePathname(); // "/dashboard/1/senial"

  // 1. Dividimos por "/" -> ["", "dashboard", "1", "senial"]
  // 2. El "1" está en la posición 2 del array
  const segments = pathname.split('/');
  const id = segments[2];

  const project = getProjectById(id);
 
  if(!project) return <div className="flex items-center justify-center flex-col gap-2 content-center h-lvh">Proyecto no encontrado
    <Button onClick={() => router.back()} content="Volver"></Button>
  </div>;

  return (
    <ProjectContext.Provider value={project}>
      <div className=" lg:pt-0 min-h-screen flex flex-col w-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarMobileOpen}
          onClose={() => setSidebarMobileOpen(false)}
        />



        {/* Header - siempre deja espacio al sidebar contraído */}
        <div className="fixed lg:pl-24 lg:pr-6 z-49 p-1 w-svw ">
          {/*<button
            onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
            className=" z-50  top-0 left-2 cursor-pointer rounded-2xl px-2 bg-gray-900 hover:bg-gray-800 flex items-center h-fit justify-center transition-colors lg:hidden"
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
          */}
          <Header />
        </div>

        <div className="mt-40 flex flex-1">
          {/* Contenido - siempre deja espacio al sidebar contraído AAAAAAAAAAA*/}
          <main className="text-black flex-1 p-1 lg:p-4 lg:pl-26 h-fit w-full max-w-[100vw] overflow-hidden">
            {children}
            {children}
          </main>
        </div>
      </div>
    </ProjectContext.Provider>
  );
}