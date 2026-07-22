import { fetcher } from '@/lib/fetcher';

export const projectsService = {
  getAll: () =>
    fetcher('/projects'),

  getById: (id) =>
    fetcher(`/projects/${id}`),
  // cache , { next: { revalidate: 30 } }

  create: (data) =>
    fetcher('/projects', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    fetcher(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    fetcher(`/projects/${id}`, { method: 'DELETE' }),

  currentTramo: (id) => 
    fetcher(`/tramos/${id}`),

  projectTramoData: (id) => 
    fetcher(`/tramos/project/${id}`),

  nft: (id) =>
    fetcher(`/nft-projects/by-project/${id}`),

  evidences: (id) => 
    fetcher(`/evidence/project/${id}`, ),

  microActionInstance: (id) => 
    fetcher(`/micro-action-instances/project/${id}`),

  getMicroActionDefinition: (pacId) => 
    fetcher(`/micro-action-definitions?pacId=${pacId}`),

  getAllTramos: () => 
    fetcher(`/tramos`),

  getProjectMembers: (idProject) => 
    fetcher(`/projects/${idProject}/members`),

  updateMicroAction: (id, data) => 
    fetcher(`/micro-action-instances/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),

  requestUploadSignature: (data) => 
    fetcher(`/evidence/request-upload-signature`, {method: 'POST', body: JSON.stringify(data)}),

  confirmUpload: (data) => 
    fetcher(`/evidence/confirm-upload`, {method: 'POST', body: JSON.stringify(data)}),

  updatePacStatus: (pacId ,data) => 
    fetcher(`/projects/pac/${pacId}`, {method: 'PATCH', body: JSON.stringify(data)}),


  categories: (tramoId) => 
    fetcher(`/categories?tramoId=${tramoId}`),

  getPacs: (categoryId) => 
    fetcher(`/pacs?categoryId=${categoryId}`),

  createProjectPac: (projectId, pacId) => 
    fetcher(`/projects/${projectId}/pac/${pacId}`, {method: 'POST'}),

  createMicroActionInstance: (data) =>
    fetcher(`/micro-action-instances`, {method: 'POST', body: JSON.stringify(data)}),

  changeActiveTranche: (projectId, tramoId, changeReason) => 
    fetcher(`/tramos/project/${projectId}/change`, {method: 'POST', body: JSON.stringify({newTramoId: tramoId, changeReason})}),

  projectReputation: (data) => 
    fetcher(`/reputation/calculate`, {method: 'POST',body: JSON.stringify(data)}),
};