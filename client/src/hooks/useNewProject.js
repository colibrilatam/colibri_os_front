import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/services/project';
import { evidencesService } from '@/services/evidences';
import { nftService } from '@/services/nft';
import { queryKeys } from '@/lib/query-keys';

export const useNewProject = () => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: (data) => projectsService.create(data),
  });

  const createNftProjectMutation = useMutation({
    mutationFn: ({ data, projectId }) => nftService.createNftProject(data, projectId),
  });

  const changeActiveTrancheMutation = useMutation({
    mutationFn: ({ projectId, tramoId, reason }) =>
      projectsService.changeActiveTranche(projectId, tramoId, reason),
  });

  const createProjectPacMutation = useMutation({
    mutationFn: ({ projectId, pacId }) =>
      projectsService.createProjectPac(projectId, pacId),
  });

  const updatePacStatusMutation = useMutation({
    mutationFn: ({ pacId, data }) => projectsService.updatePacStatus(pacId, data),
  });

  const createMicroActionInstanceMutation = useMutation({
    mutationFn: (data) => projectsService.createMicroActionInstance(data),
  });

  const createEvidenceMutation = useMutation({
    mutationFn: (data) => evidencesService.createEvidence(data),
  });

  const create = async (projectData) => {
    const descriptionEvidence = [];

    // Crear el proyecto
    const createdProject = await createProjectMutation.mutateAsync(projectData);

    // Invalidar lista de proyectos
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });

    // Obtener el primer tramo
    const allTramos = await projectsService.getAllTramos();
    const firstTramo = allTramos.find((t) => t.code === 'T1');

    // Activar el primer tramo
    await changeActiveTrancheMutation.mutateAsync({
      projectId: createdProject.id,
      tramoId: firstTramo.id,
      reason: 'Activando el primer tramo al crear el proyecto',
    });

    // Crear el proyecto NFT asociado al proyecto
    await createNftProjectMutation.mutateAsync({
      data: {
        chainId: 42,
        contractAddress: '0x1234...abcd',
        tokenId: '42',
        nftHash: createdProject.id,
        metadataUri: 'https://metadata.uri/42',
        currentVisualVersion: 'v1',
        representedTramoId: firstTramo.id,
        currentHolderUserId: createdProject.ownerUserId,
      },
      projectId: createdProject.id,
    });

    // Obtener las categorias del primer tramo
    const categories = await projectsService.categories(firstTramo.id);

    // Con cada categoría se crea un project_pac
    const fetchPacs = async (categoryId) => {
      const pacs = await projectsService.getPacs(categoryId);
      const createdProjectPac = await createProjectPacMutation.mutateAsync({
        projectId: createdProject.id,
        pacId: pacs[0].id,
      });
      return createdProjectPac;
    };

    const pacResults = await Promise.all(
      categories.map((category) => fetchPacs(category.id)),
    );

    if (pacResults.some((result) => result === null)) {
      return { error: 'Error al crear project_pac para alguna categoría' };
    }

    const pacs = pacResults.filter(Boolean);

    await updatePacStatusMutation.mutateAsync({
      pacId: pacs[0].id,
      data: { status: 'in_progress' },
    });

    // Por cada PAC se obtienen sus microactions_definition
    const fetchMicroactionsDefinition = async (pacId) => {
      return projectsService.getMicroActionDefinition(pacId);
    };

    const microActionDefinitions = await Promise.all(
      pacs.map((pac) => fetchMicroactionsDefinition(pac.pacId)),
    );

    if (microActionDefinitions.some((result) => result === null)) {
      return { error: 'Error al obtener microactions_definition para alguna PAC' };
    }

    const microActionsDefinitions = microActionDefinitions.filter(Boolean);

    // Por cada microactions_definition se crea un microaction_instance
    const fetchCreateMicroActionInstance = async (microActionDefinitionId) => {
      return createMicroActionInstanceMutation.mutateAsync({
        microActionDefinitionId: microActionDefinitionId,
        projectId: createdProject.id,
        executionWindowDaysSnapshot: 7,
        executionNotes: 'Micro acción creada automáticamente al iniciar el proyecto',
      });
    };

    const microActionInstancesResult = await Promise.all(
      microActionsDefinitions.map((microActionDefinitionArray) => {
        descriptionEvidence.push(microActionDefinitionArray[0].instruction);
        return Promise.all(
          microActionDefinitionArray.map((microActionDefinition) =>
            fetchCreateMicroActionInstance(microActionDefinition.id),
          ),
        );
      }),
    );

    if (microActionInstancesResult.some((result) => result === null)) {
      return { error: 'Error al crear microaction_instance para alguna microaction_definition' };
    }

    const microActionsInstances = microActionInstancesResult.filter(Boolean);

    // Se crea una evidencia con el ID de una microaction_instance
    const fetchCreateEvidence = async (microActionInstance, index) => {
      return createEvidenceMutation.mutateAsync({
        microActionInstanceId: microActionInstance.id,
        evidenceType: 'file',
        description: descriptionEvidence[index],
        canonicalUri: 'https://docs.google.com/document/d/abc123',
        privacyLevel: 'private',
        publicSignalEnabled: false,
      });
    };

    const evidencesResult = await Promise.all(
      microActionsInstances.map((microActionInstance, index) =>
        fetchCreateEvidence(microActionInstance[0], index),
      ),
    );

    if (evidencesResult.some((result) => result === null)) {
      return { error: 'Error al crear evidencia para alguna microaction_instance' };
    }

    // Invalidar datos del proyecto recién creado
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.detail(createdProject.id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.microActions(createdProject.id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.evidences(createdProject.id),
    });

    return createdProject;
  };

  return { create };
};
