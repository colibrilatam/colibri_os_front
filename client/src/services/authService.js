import api from "@/lib/axios";

export const register = (data) => 
    api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, data).then(r => r.data);

export const login = (data) => 
    api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, data).then(r => r.data);
