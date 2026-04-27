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

  const { data: tramoData, error: tramoError } = await handleRequest(() =>
    projectsService.currentTramo(projectData.currentTramoId),
  );

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
  /* console.log(
    'projectData:',
    projectData,
    error,
    'tramoData:',
    tramoData,
    tramoError,
    'ProjectTramoData:',
    ProjectTramoData,
    ProjectTramoError,
    'nft',
    projectNftData,
    projectNftError,
  ); */

  // Manejo de errores
  if (error || tramoError || ProjectTramoError || projectNftError) {
    return (
      <ErrorScreen
        error={error || tramoError || ProjectTramoError || projectNftError}
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
    }
    // opcional: podés mergear o usar directo
    projectData.mock = mockProjectMatch || null;
  }
  //console.log('mockProjectMatch', mockProjectMatch);
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
      }}
    >
      {children}
    </LayoutShell>
  );
}
