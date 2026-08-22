'use client';

import { useParams } from 'next/navigation';
import mockProjectsData from '@/lib/mock/projectsData.json';
import LayoutShell from './LayoutShell';
import { useProject } from '@/hooks/queries/useProject';
import { useProjectTramo } from '@/hooks/queries/useProjectTramo';
import { useProjectTramoData } from '@/hooks/queries/useProjectTramoData';
import { useProjectNft } from '@/hooks/queries/useProjectNft';
import { useProjectEvidences } from '@/hooks/queries/useProjectEvidences';
import { useProjectMicroActions } from '@/hooks/queries/useProjectMicroActions';
import ErrorScreen from '@/components/ErrorScreen';
import RetryButton from '@/components/RetryButton';
import LoadingScreen from '@/components/LoadingScreen';
import repData from './IC-hardcodeado.json';

export default function DataLayout({ children }) {
  const params = useParams();
  const id = params?.id;

  const {
    data: projectData,
    isLoading: projectLoading,
    error,
  } = useProject(id);

  const tramoId = projectData?.currentTramoId;

  const {
    data: tramoData,
    isLoading: tramoLoading,
    error: tramoError,
  } = useProjectTramo(projectData ? tramoId : null);

  const {
    data: ProjectTramoData,
    isLoading: tramoDataLoading,
    error: ProjectTramoError,
  } = useProjectTramoData(id);

  const {
    data: projectNftData,
    isLoading: nftLoading,
    error: projectNftError,
  } = useProjectNft(id);

  const {
    data: evidenceData,
    isLoading: evidenceLoading,
    error: evidenceError,
  } = useProjectEvidences(id);

  const {
    data: microActionInstanceData,
    isLoading: microActionsLoading,
    error: microActionInstanceError,
  } = useProjectMicroActions(id);

  const loading =
    projectLoading ||
    tramoLoading ||
    tramoDataLoading ||
    nftLoading ||
    evidenceLoading ||
    microActionsLoading;

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || tramoError || ProjectTramoError || projectNftError) {
    return (
      <ErrorScreen
        error={error || tramoError || ProjectTramoError || projectNftError}
        back="/home"
        reset={<RetryButton />}
      />
    );
  }

  if (!projectData) {
    return (
      <ErrorScreen
        error={{ message: 'Proyecto no encontrado' }}
        back="/home"
      />
    );
  }

  // NOTA: La tabla projects AÚN no tiene columnas _es/_en
  const enrichedProjectData = {
    ...projectData,
    shortDescription_en:
      'Fintech project in the live prototype stage that helps Colombian merchants consolidate collections, reconciliations, and cash flow alerts when operating with multiple payment methods.',
    tagline_en:
      'Streamlines reconciliations, collections, and cash flow visibility in real-world operations.',
  };

  let mockProjectMatch = mockProjectsData.find(
    (p) =>
      p.project.name?.toLowerCase().trim() ===
      enrichedProjectData.projectName?.toLowerCase().trim(),
  );

  if (!mockProjectMatch) {
    console.warn(
      'No se encontró mock para el proyecto:',
      enrichedProjectData.projectName,
    );
    mockProjectMatch = mockProjectsData[0];
  }

  enrichedProjectData.mock = mockProjectMatch || mockProjectsData[0];

  const translatableContent = {
    project: {
      tagline: enrichedProjectData.tagline_en,
      shortDescription: enrichedProjectData.shortDescription_en,
    },
    evidences: {},
    microActions: {},
  };

  return (
    <LayoutShell
      projectInfo={{
        dbProject: enrichedProjectData,
        mockProject: mockProjectMatch,
        tramoData: tramoData,
        projectTramoData: ProjectTramoData,
        projectNftData: projectNftData,
        evidenceData: evidenceData || null,
        microActionInstanceData: microActionInstanceData || null,
        translatableContent,
        reputationData: repData,
      }}
    >
      {children}
    </LayoutShell>
  );
}
