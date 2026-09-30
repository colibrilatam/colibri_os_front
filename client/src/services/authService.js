import { apiClient } from '@/lib/api';
import { validateResponse } from '@/lib/contracts/validate';
import { AuthResponseSchema, RegisterResponseSchema, CompleteProfileResponseSchema, MessageResponseSchema } from '@/lib/contracts/generated';

export const authService = {
    register: async (data) => {
        const response = await apiClient.post('/auth/signup', data);
        return validateResponse(RegisterResponseSchema, response.data);
    },

    login: async (data) => {
        const response = await apiClient.post('/auth/signin', data);
        return validateResponse(AuthResponseSchema, response.data);
    },
    completeProfile: async (data) => {
        const response = await apiClient.post('/auth/complete-profile', data);
        return validateResponse(CompleteProfileResponseSchema, response.data);
    },
    logout: async() => {
        const response = await apiClient.post('/auth/logout'); 
        return validateResponse(MessageResponseSchema, response.data);
    }
};
