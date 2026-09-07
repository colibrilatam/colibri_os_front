import mockProjectsData from '@/lib/mock/projectsData.json';
import { notFound } from 'next/navigation';
import LayoutShell from './LayoutShell';
import { projectsService } from '@/services/project';
import { handleRequest } from '@/lib/handleRequest';
import ErrorScreen from '@/components/ErrorScreen';
import RetryButton from '@/components/RetryButton';
import repData from './IC-hardcodeado.json';

export default async function DataLayout({ children, params }) {
  const { id } = await params;

  const { data: projectData, error } = await handleRequest(() =>
    projectsService.getById(id),
  );

  // Proyecto no encontrado / error al obtenerlo
  if (error) {
    return (
      <ErrorScreen
        error={error}
        back="/home"
        reset={<RetryButton />}
      />
    );
  }

  if (!projectData) {
    notFound();
  }

  // Validación mínima del DTO del proyecto
  if (
    !projectData.id ||
    !projectData.projectName ||
    !projectData.currentTramoId
  ) {
    return (
      <ErrorScreen
        error={
          new Error(
            'Los datos del proyecto están incompletos. No se puede cargar el dashboard.',
          )
        }
        back="/home"
        reset={<RetryButton />}
      />
    );
  }

  /*
   * El mock es opcional.
   *
   * Solo se utiliza cuando existe una coincidencia exacta
   * con el proyecto real.
   *
   * NO hay fallback a mockProjectsData[0].
   */
  const mockProjectMatch = mockProjectsData.find(
    (project) =>
      project.project.name?.toLowerCase().trim() ===
      projectData.projectName?.toLowerCase().trim(),
  );

  // Datos del tramo actual
  const { data: currentTramoData, error: tramoError } = await handleRequest(() =>
    projectsService.currentTramo(projectData.currentTramoId),
  );

  // Datos de los tramos del proyecto
  const { data: projectTramoData, error: projectTramoError } =
    await handleRequest(() =>
      projectsService.projectTramoData(id),
    );

  // NFT del proyecto
  const { data: projectNftData, error: projectNftError } =
    await handleRequest(() =>
      projectsService.nft(id),
    );

  // Evidencias
  const { data: evidenceData, error: evidenceError } =
    await handleRequest(() =>
      projectsService.evidences(id),
    );

  // Microacciones
  const {
    data: microActionInstanceData,
    error: microActionInstanceError,
  } = await handleRequest(() =>
    projectsService.microActionInstance(id),
  );

  /*
   * Si falla cualquiera de las dependencias necesarias,
   * mostramos el estado de error.
   *
   * Nunca utilizamos un mock para reemplazar datos reales.
   */
  const dependencyError =
    tramoError ||
    projectTramoError ||
    projectNftError ||
    evidenceError ||
    microActionInstanceError;

  if (dependencyError) {
    return (
      <ErrorScreen
        error={dependencyError}
        back="/home"
        reset={<RetryButton />}
      />
    );
  }

  return (
    <LayoutShell
      projectInfo={{
        dbProject: projectData,
        mockProject: mockProjectMatch ?? {},
        currentTramoData,
        projectTramoData,
        projectNftData,
        evidenceData: evidenceData || null,
        microActionInstanceData: microActionInstanceData || null,
        reputationData: repData,
      }}
    >
      {children}
    </LayoutShell>
  );
}