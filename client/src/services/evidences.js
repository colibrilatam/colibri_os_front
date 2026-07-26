import { apiClient } from '@/lib/api';

export const evidencesService = {
    createEvidence: async (data) => {
        const response = await apiClient.post('/evidence', data);
        return response.data;
    },

    submit: async (evidenceId) => {
        const response = await apiClient.post(`/evidence/${evidenceId}/submit`);
        return response.data;
    },
    
    createEvaluation: async (data) => {
        const response = await apiClient.post('/evaluations', data);
        return response.data;
    },

    getActiveRubrics: async () => {
        const response = await apiClient.get('/evaluations/rubrics/active');
        return response.data;
    },

    closeEvaluation: async (data) => {
        const response = await apiClient.post('/evaluations/finalize', data);
        return response.data;
    },
};
