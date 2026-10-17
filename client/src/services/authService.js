import { apiClient } from '@/lib/api';
import { validateResponse } from '@/lib/contracts/validate';
import { AuthResponseSchema, RegisterResponseSchema, CompleteProfileResponseSchema, MessageResponseSchema, GoogleExchangeResponseSchema } from '@/lib/contracts/generated';

export const authService = {
    register: async (data) => {
        const response = await apiClient.post('/auth/signup', data);
        return validateResponse(RegisterResponseSchema, response.data);
    },

    login: async (data) => {
        const response = await apiClient.post('/auth/signin', data);
        return validateResponse(AuthResponseSchema, response.data);
    },

    /**
     * SEC-002: login demo sin password.
     *
     * El backend emite un token con role=demo_readonly y setea la cookie
     * HttpOnly. El body acepta un selector de persona para elegir que
     * cuenta demo usar. No hay password en el request ni en el bundle.
     */
    demoLogin: async (role) => {
        const response = await apiClient.post('/auth/demo-login', { role });
        return validateResponse(AuthResponseSchema, response.data);
    },

    exchangeGoogleCode: async (code) => {
        const response = await apiClient.post('/auth/google/exchange', { code });
        return validateResponse(GoogleExchangeResponseSchema, response.data);
    },

    completeProfile: async (data) => {
        // data = { profileCompletionToken, role, gender }
        const response = await apiClient.post('/auth/complete-profile', data);
        return validateResponse(CompleteProfileResponseSchema, response.data);
    },
    logout: async() => {
        const response = await apiClient.post('/auth/logout'); 
        return validateResponse(MessageResponseSchema, response.data);
    }
};
