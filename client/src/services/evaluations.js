import { apiClient } from '@/lib/api';

export const evaluationsService = {
  getEvaluations: async (params = {}) => {
    const response = await apiClient.get('/evaluations', {
      params,
    });

    return response.data;
  },
  // Queue de revisión
  getPendingReviews: async () => {
    const response = await apiClient.get('/evaluations/pending-reviews');
    //console.log('services-evidences----', response.data);

    return response.data;
  },

  // Evaluaciones de una evidencia
  getByEvidence: async (evidenceId) => {
    const response = await apiClient.get(`/evaluations/evidence/${evidenceId}`);
    return response.data;
  },

  // Una evaluación
  getById: async (id) => {
    const response = await apiClient.get(`/evaluations/${id}`);
    return response.data;
  },

  // Crear evaluación
  create: async (data) => {
    const response = await apiClient.post('/evaluations', data);
    return response.data;
  },

  // Registrar revisión humana
  submitHumanReview: async (data) => {
    const response = await apiClient.post('/evaluations/human-review', data);
    return response.data;
  },

  // Finalizar evaluación
  finalize: async (data) => {
    const response = await apiClient.post('/evaluations/finalize', data);
    return response.data;
  },

  // Rúbricas
  getActiveRubrics: async () => {
    const response = await apiClient.get('/evaluations/rubrics/active');
    return response.data;
  },

  getRubricById: async (id) => {
    const response = await apiClient.get(`/evaluations/rubrics/${id}`);
    return response.data;
  },
};
