import mockDataProject from "@/lib/mock/proyectos ficticios/dataProjects.json";
import { notFound } from "next/navigation";
import LayoutShell from "./LayoutShell";
import { projectsService } from "@/services/project";
import { handleRequest } from "@/lib/handleRequest";

export default async function DataLayout({ children, params }) {

  // Obtener el ID de la URL
  const { id } = await params;

  // Obtener información del proyecto desde el backend
  const { data: projectData, error } = await handleRequest(
    () => projectsService.getById(id)
  );





  const { data: tramoData, error: tramoError } = await handleRequest(
    () => projectsService.currentTramo(projectData.currentTramoId)
  );

  const { data: ProjectTramoData, error: ProjectTramoError } = await handleRequest(
    () => projectsService.projectTramoData(id)
  );
  const { data: projectNftData, error: projectNftError } = await handleRequest(
    () => projectsService.nft(id)
  );

    const { data: evidenceData, error: evidenceError } = await handleRequest(
      () => projectsService.evidences(id)
    );
  
  const { data: microActionInstanceData, error: microActionInstanceError } = await handleRequest(
    () => projectsService.microActionInstance(id)
  );
  console.log("projectData:", projectData,
     "tramoData:", tramoData,
      "ProjectTramoData:", ProjectTramoData,
       "projectNftData:", projectNftData,
        "evidenceData:", evidenceData,
         "microActionInstanceData:", microActionInstanceData);

  // Manejo de errores
  if( error || tramoError || ProjectTramoError ) {
    return <div className="flex items-center justify-center flex-col gap-2 content-center h-lvh">
              Error al cargar el proyecto: 
                {
                  JSON.stringify(error) 
                  || JSON.stringify(tramoError) 
                  || JSON.stringify(ProjectTramoError)
                  
                }
            </div>;
  }

  // Si no se encuentra el proyecto, mostrar página de error
  if(!projectData) {
    notFound();
  }
  
  return (
    
      <LayoutShell projectInfo={{dbProject: projectData,
        mockProject: mockDataProject,
        tramoData: tramoData,
        projectTramoData: ProjectTramoData,
        projectNftData: projectNftData,
        evidenceData: evidenceData || null,
        microActionInstanceData: microActionInstanceData || null,
        

        }}>
        {children}
      </LayoutShell>
    
  );
}