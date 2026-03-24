import api from "@/lib/axios";

export const register = (data) => 
    api.post('/auth/signup', data).then(r => r.data)
