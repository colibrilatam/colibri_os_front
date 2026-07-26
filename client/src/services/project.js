import { apiClient } from '@/lib/api';

export const projectsService = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  currentTramo: async (id) => {
    const response = await apiClient.get(`/tramos/${id}`);
    return response.data;
  },

  projectTramoData: async (id) => {
    const response = await apiClient.get(`/tramos/project/${id}`);
    return response.data;
  },

  nft: async (id) => {
    const response = await apiClient.get(`/nft-projects/by-project/${id}`);
    return response.data;
  },

  evidences: async (id) => {
    const response = await apiClient.get(`/evidence/project/${id}`);
    return response.data;
  },

  microActionInstance: async (id) => {
    const response = await apiClient.get(`/micro-action-instances/project/${id}`);
    return response.data;
  },

  getMicroActionDefinition: async (pacId) => {
    const response = await apiClient.get(`/micro-action-definitions?pacId=${pacId}`);
    return response.data;
  },

  getAllTramos: async () => {
    const response = await apiClient.get(`/tramos`);
    return response.data;
  },

  getProjectMembers: async (idProject) => {
    const response = await apiClient.get(`/projects/${idProject}/members`);
    return response.data;
  },

  updateMicroAction: async (id, data) => {
    const response = await apiClient.patch(`/micro-action-instances/${id}`, data);
    return response.data;
  },

  requestUploadSignature: async (data) => {
    const response = await apiClient.post(`/evidence/request-upload-signature`, data);
    return response.data;
  },

  confirmUpload: async (data) => {
    const response = await apiClient.post(`/evidence/confirm-upload`, data);
    return response.data;
  },

  updatePacStatus: async (pacId, data) => {
    const response = await apiClient.patch(`/projects/pac/${pacId}`, data);
    return response.data;
  },

  categories: async (tramoId) => {
    const response = await apiClient.get(`/categories?tramoId=${tramoId}`);
    return response.data;
  },

  getPacs: async (categoryId) => {
    const response = await apiClient.get(`/pacs?categoryId=${categoryId}`);
    return response.data;
  },

  createProjectPac: async (projectId, pacId) => {
    const response = await apiClient.post(`/projects/${projectId}/pac/${pacId}`);
    return response.data;
  },

  createMicroActionInstance: async (data) => {
    const response = await apiClient.post(`/micro-action-instances`, data);
    return response.data;
  },

  changeActiveTranche: async (projectId, tramoId, changeReason) => {
    const response = await apiClient.post(`/tramos/project/${projectId}/change`, {
      newTramoId: tramoId,
      changeReason,
    });
    return response.data;
  },

  projectReputation: async (data) => {
    const response = await apiClient.post(`/reputation/calculate`, data);
    return response.data;
  },
};
