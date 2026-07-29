import { apiClient } from '@/lib/api';

export const authService = {
    register: async (data) => {
        const response = await apiClient.post('/auth/signup', data);
        return response.data;
    },

    login: async (data) => {
        const response = await apiClient.post('/auth/signin', data);
       return response.data;
    },
};
