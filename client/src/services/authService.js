import api from "@/lib/axios";

export const register = (data) => 
    api.post('/auth/signup', data).then(r => r.data);

export const login = (data) => 
    api.post('/auth/signin', data).then(r => r.data);
