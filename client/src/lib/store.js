import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isTokenExpired } from './auth';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // Estado existente
      rol: 'CEO',
      setRol: (newRol) => set({ rol: newRol }),

      // Token
      token: null,
      setToken: (token) => set({ token }),
      getToken: () => get().token,
      logout: () => set({ token: null, rol: null }),

      // Verificar si hay token y si es válido
      isAuthenticated: () => {
  const token = get().token
  if (isTokenExpired(token)) {
    set({ token: null })
    return false
  }
  return true
},
    }),

    
    {
      name: 'auth', // key en localStorage
    }
  )
);