import { apiClient } from '@/lib/api';
import { validateResponse } from '@/lib/contracts/validate';
import { UserSchema } from '@/lib/contracts/generated';

export const userService = {
    profile: async () => {
        const response = await apiClient.get('/users/profile');
        return validateResponse(UserSchema, response.data);
    },

    userData: async (userId) => {
        const response = await apiClient.get(`/users/${userId}`);
        return validateResponse(UserSchema, response.data);
    },

    logout: async() => {
  const response = await apiClient.post('/auth/logout'); 
  return response.data;
}
};
