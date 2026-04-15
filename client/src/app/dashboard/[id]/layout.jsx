//import { usePathname } from "next/navigation";
import mockDataProject from "@/lib/mock/proyectos ficticios/dataProjects.json";

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
// import { useUserStore } from "@/lib/store";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
// import { useEffect, useState } from "react";
import LayoutShell from "./LayoutShell";
// import { useRequest } from "@/hooks/useRequest";
import { projectsService } from "@/services/project";
import { handleRequest } from "@/lib/handleRequest";



export default async function DataLayout({ children, params }) {
  // hook para manejar petición al backend
  
  // const { execute, loading, error } = useRequest(projectsService.getById); 
  

  // estado del sidebar
    /*const sidebarMobileOpen = useUserStore((state) => state.sidebarMobileOpen);
    const setSidebarMobileOpen = useUserStore(
      (state) => state.setSidebarMobileOpen,
    );*/
  // Obtener el ID de la URL
  const { id } = await params;
  // Obtener información del proyecto desde el backend
  const { data: projectData, error } = await handleRequest(
    () => projectsService.getById(id)
  );
  const { data: tramoData, error: tramoError } = await handleRequest(
    () => projectsService.currentTramo(projectData.currentTramoId)
  );

  if(error || tramoError) {
    return <div className="flex items-center justify-center flex-col gap-2 content-center h-lvh">Error al cargar el proyecto: {JSON.stringify(error) || JSON.stringify(tramoError)}</div>;
  }
  if(!projectData) {
    notFound();
  }
  

/*
  if(projectError) return <div className="flex items-center justify-center flex-col gap-2 content-center h-lvh">Error al cargar el proyecto: {projectError}
    <Button onClick={() => router.back()} content="Volver"></Button>
  </div>;
 
  if(!project) return <div className="flex items-center justify-center flex-col gap-2 content-center h-lvh">Proyecto no encontrado
    <Button onClick={() => router.back()} content="Volver"></Button>
  </div>;
*/
  return (
    
      <LayoutShell projectInfo={{dbProject: projectData, mockProject: mockDataProject, tramoData: tramoData}}>
        {children}
      </LayoutShell>
    
  );
}