import { apiClient } from '@/lib/api';

export const userService = {
    profile: async () => {
        const response = await apiClient.get('/users/profile');
        return response.data;
    },

    userData: async (userId) => {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },

    logout: async() => {
  const response = await apiClient.post('/auth/logout'); 
  return response.data;
}
};
