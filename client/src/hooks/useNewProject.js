import { useRequest } from './useRequest';
import { projectsService } from '@/services/project';
import {evidencesService} from '@/services/evidences';
import useEffect from 'react';
import {nftService} from '@/services/nft';

export const useNewProject = () => {
  // Declarar las peticiones al back
  const { execute: createProject } = useRequest(projectsService.create);
  const { execute: getAllTramos } = useRequest(projectsService.getAllTramos);
  const { execute: getCategories } = useRequest(projectsService.categories);
  const { execute: getPacs } = useRequest(projectsService.getPacs);
  const { execute: getMicroActionDefinition } = useRequest(projectsService.getMicroActionDefinition);
  const { execute: createProjectPac } = useRequest(projectsService.createProjectPac);
  const { execute: createMicroActionInstance } = useRequest(projectsService.createMicroActionInstance);
  const { execute: createEvidence } = useRequest(evidencesService.createEvidence);
  const { execute: changeActiveTranche } = useRequest(projectsService.changeActiveTranche);
  const { execute: createNftProject } = useRequest(nftService.createNftProject);
  const { execute: updatePacStatus } = useRequest(projectsService.updatePacStatus);

  // Función asíncrona para realizar las peticiones
  const create = async (projectData) => {
    const descriptionEvidence = [];
    console.log(projectData);
    // Crear el proyecto
    const { data: createdProject, error: createProjectError } = await createProject(projectData);
    if (createProjectError) {
      console.log(createProjectError);
      return { error: 'Error al crear el proyecto' };
    }

    

    // Obtener el primer tramo
    const { data: allTramos, error: getAllTramosError } = await getAllTramos();
    if (getAllTramosError) {
      console.log(getAllTramosError);
      return { error: 'Error al obtener los tramos' };
    }
    const firstTramo = allTramos.find((t) => t.code === 'T1');

    // Activar el primer tramo
    const { error: changeTrancheError } = await changeActiveTranche(createdProject.id, firstTramo.id, 'Activando el primer tramo al crear el proyecto');
    if(changeTrancheError){
      console.log(changeTrancheError);
      return { error: 'Error al activar el primer tramo' };
    }

    // Crear el proyecto NFT asociado al proyecto
    const { data: createdNftProject, error: createNftProjectError } = await createNftProject(
      {
  chainId: 42,
  contractAddress: "0x1234...abcd",
  tokenId: "42",
  nftHash: createdProject.id,
  metadataUri: "https://metadata.uri/42",
  currentVisualVersion: "v1",
  representedTramoId: firstTramo.id,
  currentHolderUserId: createdProject.ownerUserId
},
      createdProject.id
    );
    if (createNftProjectError) {
      console.log(createNftProjectError);
      return { error: 'Error al crear el proyecto NFT' };
    }

    // Obtener las categorias del primer tramo
    const { data: categories, error: getCategoriesError } = await getCategories(firstTramo.id);
    if (getCategoriesError) {
      console.log(getCategoriesError);
      return { error: 'Error al obtener las categorías del primer tramo' };
    }
    //console.log(categories);

    // Con cada categoría se crea un project_pac
    const fetchPacs = async (categoryId) => {
      const { data: pac, error } = await getPacs(categoryId);
      if (error) {
        console.log(error);
        return null;
      }
      const { data: createdProjectPac, error: createProjectPacError } = await createProjectPac(createdProject.id, pac[0].id);
      if(createProjectPacError){
        console.log(createProjectPacError);
        return null;
      }
      return createdProjectPac;
    };
    const pacResults = await Promise.all(
      categories.map((category) => fetchPacs(category.id)),
    );

    if(pacResults.some((result) => result === null)){
      console.log('Error al crear project_pac para alguna categoría');
      return { error: 'Error al crear project_pac para alguna categoría' };
    }
    const pacs = pacResults.filter(Boolean); // elimina los null (errores)
    console.log('project_pacs',pacs);

    const { data: updatedProject, error: updatePacStatusError } = await updatePacStatus(pacs[0].id, {status: 'in_progress'});
    if(updatePacStatusError){
      console.log(updatePacStatusError);
      //return { error: 'Error al actualizar el estado del primer project_pac' };
    }
    

    // Por cada PAC se obtienen sus microactions_definition
    const fetchMiroactionsDefinition = async (pacId) => {
        const {data: microActionDefinitionResponse, error } = await getMicroActionDefinition(pacId);
        if(error){
            console.log(error);
            return null;
        }
        return microActionDefinitionResponse;
    }

    const microActionDefinitions = await Promise.all(
        pacs.map((pac) => fetchMiroactionsDefinition(pac.pacId))
    );
    if(microActionDefinitions.some((result) => result === null)){
        console.log('Error al obtener microactions_definition para alguna PAC');
        return { error: 'Error al obtener microactions_definition para alguna PAC' };
    }

    const microActionsDefinitions = microActionDefinitions.filter(Boolean);
    console.log('microaction def',microActionsDefinitions);

    // Por cada miroactions_definition se crea un microaction_instance
    const fetchCreateMicroActionInstace = async (microActionDefinitionId) => {
      const { data: createdMicroActionInstance, error } = await createMicroActionInstance({
        microActionDefinitionId:microActionDefinitionId,
        projectId: createdProject.id,
        executionWindowDaysSnapshot: 7,
        executionNotes: "Micro acción creada automáticamente al iniciar el proyecto",
      });
      if(error){
        console.log(error);
        return null;
      }
      return createdMicroActionInstance;
    }

    const microActionInstancesResult = await Promise.all(
    microActionsDefinitions.map((microActionDefinitionArray) => {
        descriptionEvidence.push(microActionDefinitionArray[0].instruction);
        return Promise.all(
            microActionDefinitionArray.map((microActionDefinition) => fetchCreateMicroActionInstace(microActionDefinition.id))
        );
      }
    )
    );
    if(microActionInstancesResult.some((result) => result === null)){
      console.log('Error al crear microaction_instance para alguna microaction_definition');
      return { error: 'Error al crear microaction_instance para alguna microaction_definition' };
    }
    const microActionsInstaces = microActionInstancesResult.filter(Boolean);

    console.log('microaction instance', microActionsInstaces);
    console.log('descriptionEvidence', descriptionEvidence);
    // Se crea una evidencia con el ID de una microaction_instance
    const fetchCreateEvidence = async (microActionInstance, index) => {
      const { data: createdEvidence, error } = await createEvidence({
        microActionInstanceId: microActionInstance.id,
        projectId: createdProject.id,
        evidenceType: "file",
        description: descriptionEvidence[index],
        canonicalUri: 'https://docs.google.com/document/d/abc123',
        privacyLevel: 'private',
        publicSignalEnabled: false,
      });
      if(error){
        console.log(error);
        return null;
      }
      return createdEvidence;
  };

  const evidencesResult = await Promise.all(
    microActionsInstaces.map((microActionInstance, index) => fetchCreateEvidence(microActionInstance[0], index))
  );
  if(evidencesResult.some((result) => result === null)){
    console.log('Error al crear evidencia para alguna microaction_instance');
    return { error: 'Error al crear evidencia para alguna microaction_instance' };
  }
  const evidences = evidencesResult.filter(Boolean);
  console.log('evidences', evidences);
  

  return createdProject;
  
  }
  return { create };
};



          