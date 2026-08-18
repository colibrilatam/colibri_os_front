import { apiClient } from '@/lib/api';

export const microActionService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/micro-action-instances/all', {
      params,
    });

    return response.data;
  },

  /**
   * Obtener una microacción completa con sus relaciones.
   */
  getById: async (id) => {
    const response = await apiClient.get(`/micro-action-instances/${id}`);
    return response.data;
  },

   /**
   * Actualizar el estado de la version si es aporbada o rechazada.
   */

  resolveVersion: async (versionId, data) => {
  const response = await apiClient.patch(
    `/micro-action-instances/versions/${versionId}`,
    data,
  );

  return response.data;
},

  /**
   * Crear una nueva versión de una microacción.
   */

  createVersion: async (instanceId, { file, executionNotes }) => {
    const body = new FormData();
    body.append('file', file);

    if (
      executionNotes !== null &&
      executionNotes !== undefined &&
      executionNotes !== ''
    ) {
      body.append('executionNotes', executionNotes);
    }

    const response = await apiClient.post(
      `/micro-action-instances/${instanceId}/versions`,
      body,
    );

    return response.data;
  },
};
