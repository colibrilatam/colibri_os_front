import mockDataProject from '@/lib/mock/proyectos ficticios/dataProjects.json';
import mockProjectsData from '@/lib/mock/projectsData.json';
import { notFound } from 'next/navigation';
import LayoutShell from './LayoutShell';
import { projectsService } from '@/services/project';
import { handleRequest } from '@/lib/handleRequest';
import ErrorScreen from '@/components/ErrorScreen';

export default async function DataLayout({ children, params }) {
  // Obtener el ID de la URL
  const { id } = await params;

  // Obtener información del proyecto desde el backend
  const { data: projectData, error } = await handleRequest(() =>
    projectsService.getById(id),
  );

  projectData.shortDescription_en =
    'Fintech project in the live prototype stage that helps Colombian merchants consolidate collections, reconciliations, and cash flow alerts when operating with multiple payment methods.';

  projectData.tagline_en =
    'Streamlines reconciliations, collections, and cash flow visibility in real-world operations.';

  //console.log(projectData);

  // tramo.json
  const { data: tramoData, error: tramoError } = await handleRequest(() =>
    projectsService.currentTramo(projectData.currentTramoId),
  );
   const { data: reputationData, error: reputationDataError } = await handleRequest(() =>
    projectsService.projectReputation({projectId: projectData.id, userId: projectData.ownerUserId}),
  );

  // allTramosProject.json
  const { data: ProjectTramoData, error: ProjectTramoError } =
    await handleRequest(() => projectsService.projectTramoData(id));

  const { data: projectNftData, error: projectNftError } = await handleRequest(
    () => projectsService.nft(id),
  );

  const { data: evidenceData, error: evidenceError } = await handleRequest(() =>
    projectsService.evidences(id),
  );

  const { data: microActionInstanceData, error: microActionInstanceError } =
    await handleRequest(() => projectsService.microActionInstance(id));

  // Manejo de errores
  if (error || tramoError || ProjectTramoError || projectNftError ||reputationDataError) {
    return (
      <ErrorScreen
        error={error || tramoError || ProjectTramoError || projectNftError || reputationDataError}
        back="/home"
      />
    );
  }

  // Si no se encuentra el proyecto, mostrar página de error
  let mockProjectMatch = null;
  if (!projectData) {
    notFound();
  }

  if (projectData) {
    mockProjectMatch = mockProjectsData.find(
      (p) =>
        p.project.name?.toLowerCase().trim() ===
        projectData.projectName?.toLowerCase().trim(),
    );

    if (!mockProjectMatch) {
      console.warn(
        'No se encontró mock para el proyecto:',
        projectData.projectName,
      );
      mockProjectMatch = mockProjectsData[0];
    }
    projectData.mock = mockProjectMatch || mockProjectsData[0];
  }
  const translatableContent = {
    project: {
      tagline: projectData.tagline_en,
      shortDescription: projectData.shortDescription_en,
    },

    evidences: {},
    microActions: {},
  };
  
  
  return (
    <LayoutShell
      projectInfo={{
        dbProject: projectData,
        mockProject: mockProjectMatch,
        tramoData: tramoData,
        projectTramoData: ProjectTramoData,
        projectNftData: projectNftData,
        evidenceData: evidenceData || null,
        microActionInstanceData: microActionInstanceData || null,
        translatableContent,
        reputationData
      }}
    >
      {children}
    </LayoutShell>
  );
}
