import { apiClient } from '@/lib/api';

export const nftService = {
    getStats: async (userId) => {
        const response = await apiClient.get(`/mecenas-semilla/dashboard/${userId}`);
        return response.data;
    },

    create: async (data, userId) => {
        const response = await apiClient.post(`/mecenas-semilla/buy-nfts/${userId}`, data);
        return response.data;
    },

    createNftProject: async (data, projectId) => {
        const response = await apiClient.post(`/nft-projects/${projectId}`, data);
        return response.data;
    },

    getNftProjects: async () => {
        const response = await apiClient.get('/nft-projects');
        return response.data;
    },
};
