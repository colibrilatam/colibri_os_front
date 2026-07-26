import { apiClient } from '@/lib/api';

export const authService = {
    register: async (data) => {
        const response = await apiClient.post('/auth/signup', data);
        return response.data;
    },

    login: async (data) => {
        console.log('hola')
        const response = await apiClient.post('/auth/signin', data);
console.log('holaasdasd')
       return response.data;
    },
};
