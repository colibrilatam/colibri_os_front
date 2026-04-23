import api from "@/lib/axios";
import { fetcher } from "@/lib/fetcher";

export const authService = {
    register: (data) =>
        fetcher('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

    login: (data) =>
        fetcher('/auth/signin', { method: 'POST', body: JSON.stringify(data) }),

    userData: () => fetcher('/users/profile'),
};

export const register = (data) => 
    api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, data).then(r => r.data);

export const login = (data) => 
    api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, data).then(r => r.data);
