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

      // Estado del Sidebar
      sidebarMobileOpen: false,
      setSidebarMobileOpen: (isOpen) => set({ sidebarMobileOpen: isOpen }),
      toggleSidebarMobile: () => set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),

      // Estado del Sidebar en Desktop (colapsado/expandido)
      sidebarDesktopExpanded: false,
      setSidebarDesktopExpanded: (isExpanded) => set({ sidebarDesktopExpanded: isExpanded }),
      toggleSidebarDesktop: () => set((state) => ({ sidebarDesktopExpanded: !state.sidebarDesktopExpanded })),
    }),

    
    {
      name: 'app-state', // key en localStorage
    }
  )
);