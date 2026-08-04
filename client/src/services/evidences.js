import { apiClient } from '@/lib/api';

export const evidencesService = {
  // Crear evidencia
  createEvidence: async (data) => {
    const response = await apiClient.post('/evidence', data);
    return response.data;
  },

  // Enviar evidencia a revisión
  submit: async (evidenceId) => {
    const response = await apiClient.post(`/evidence/${evidenceId}/submit`);
    return response.data;
  },

  // Obtener todas las evidencias de un proyecto
  getProjectEvidences: async (projectId) => {
    const response = await apiClient.get(`/evidence/project/${projectId}`);
    return response.data;
  },

  // Obtener todas las evidencias de una microacción
  getMicroActionInstanceEvidences: async (instanceId) => {
    const response = await apiClient.get(
      `/evidence/micro-action-instance/${instanceId}`,
    );
    return response.data;
  },

  // Obtener una evidencia por ID
  getById: async (evidenceId) => {
    const response = await apiClient.get(`/evidence/${evidenceId}`);
    //console.log("EVIDENCIA-ID---",response.data);

    return response.data;
  },

  // Obtener historial de versiones
  getVersions: async (evidenceId) => {
    const response = await apiClient.get(`/evidence/${evidenceId}/versions`);
    return response.data;
  },
};
