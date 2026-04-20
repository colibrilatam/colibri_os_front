"use client"
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useUserStore } from "@/lib/store";
import { ProjectContext } from '@/lib/projectContext';


export default function LayoutShell({ children, projectInfo }) {
    
    // estado del sidebar
    const sidebarMobileOpen = useUserStore((state) => state.sidebarMobileOpen);
    const setSidebarMobileOpen = useUserStore(
      (state) => state.setSidebarMobileOpen,
    );

    return (
        <ProjectContext.Provider value={projectInfo}>
            <div className=" lg:pt-0 min-h-screen flex flex-col w-full">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarMobileOpen}
                    onClose={() => setSidebarMobileOpen(false)}
                />



                {/* Header - siempre deja espacio al sidebar contraído */}
                <div className="fixed lg:pl-24 lg:pr-6 z-49 p-1 w-svw ">


                    <Header />
                </div>
                <button
                    onClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
                    className="fixed z-49 md:top-34 top-42 left-2 cursor-pointer rounded-2xl px-2 bg-gray-900 hover:bg-gray-800 flex items-center h-fit justify-center transition-colors lg:hidden"
                    title={sidebarMobileOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
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

                <div className="mt-55 md:mt-46 xl:mt-36 flex flex-1">
                    {/* Contenido - siempre deja espacio al sidebar contraído AAAAAAAAAAA*/}
                    <main className="text-black flex-1 p-1 lg:p-4 lg:pl-26 h-fit w-full max-w-[100vw] overflow-hidden">
                        {children}
                    </main>
                </div>

            </div>
        </ProjectContext.Provider>
    )
}