"use client"
import { getProjectById } from "@/lib/mock/proyectos ficticios/getProyectById";
import { usePathname } from "next/navigation";
import { createContext } from "react";

export const ProjectContext = createContext();

export default function DataLayout({ children }) {



// obtencion del id por parametro 
  const pathname = usePathname(); // "/dashboard/1/senial"

  // 1. Dividimos por "/" -> ["", "dashboard", "1", "senial"]
  // 2. El "1" está en la posición 2 del array
  const segments = pathname.split('/');
  const id = segments[2];

  const project = getProjectById(id);
  

  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}