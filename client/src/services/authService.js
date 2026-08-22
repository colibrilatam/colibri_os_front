import { apiClient } from '@/lib/api';
import { validateResponse } from '@/lib/api/contract';
import { AuthResponseSchema, RegisterResponseSchema } from '@colibri/contracts';

export const authService = {
    register: async (data) => {
        const response = await apiClient.post('/auth/signup', data);
        return validateResponse(RegisterResponseSchema, response.data);
    },

    login: async (data) => {
        const response = await apiClient.post('/auth/signin', data);
        return validateResponse(AuthResponseSchema, response.data);
    },
};
