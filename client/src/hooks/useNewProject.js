import { useRequest } from "./useRequest"
import { projectsService } from '@/services/project';
import useEffect from "react";

export const useNewProject = (projectData) => {
    // Declarar las peticiones al back
    const { execute: createProject } = useRequest(projectsService.create);
    const { execute: getAllTramos } = useRequest(projectsService.getAllTramos);
    const { execute: getCategories } = useRequest(projectsService.categories);

    // Función asíncrona para realizar las peticiones
    const create = async() => {
        // Crear el proyecto
        //const { data: createdProject } = await createProject(projectData);

        // Obtener el primer tramo
        const { data: allTramos } = await getAllTramos();
        const firstTramo = allTramos.find((t) => t.code === 'T1');

        // Obtener las categorias del primer tramo
        const { data: categories } = await getCategories(firstTramo.id);
        console.log(categories);

        // Con cada categoría se crea un project_pac

        // Por cada PAC se obtienen sus microactions_definition

        // Por cada miroactions_definition se crea un microaction_instance

        // Se crea una evidencia con el ID de una microaction_instance
    };
    
    return { create }
}