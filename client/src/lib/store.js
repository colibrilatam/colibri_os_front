import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isTokenExpired } from './auth';
import { setCookie, deleteCookie } from './cookies';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // Demo
      isDemo: true,
      setIsDemo: (isDemo) => set({ isDemo }),

      // Estado existente
      rol: 'CEO',
      setRol: (newRol) => set({ rol: newRol }),

      // Token
      token: null,
      setToken: (token) => {
        set({ token })
        if (typeof window !== 'undefined') {
          if (token) {
            setCookie('token', token)
          } else {
            deleteCookie('token')
          }
        }
        // Si se establece un token, desactivar modo invitado
        set({ isGuest: false }) 
        deleteCookie('isGuest')
      },
      getToken: () => get().token,

      // Guest mode
      isGuest: false,
      setIsGuest: (isGuest) => {
        set({ isGuest })
        if (typeof window !== 'undefined') {
          if (isGuest) {
            setCookie('isGuest', 'true')
          } else {
            deleteCookie('isGuest')
          }
        }
      },

      // Logout
      logout: () => {
        if (typeof window !== 'undefined') {
          deleteCookie('token')
          deleteCookie('isGuest')
        }
        set({ token: null, rol: null, isGuest: false, sidebarDesktopExpanded: false })
      },

      // Verificar si hay token y si es válido, o si es invitado
      isAuthenticated: (guest = false) => {
  const token = get().token
  //const isGuest = get().isGuest
  
  // Si es invitado, está autenticado sin token
  // El parámetro 'guest' permite verificar explícitamente el modo invitado
  // no se bien por que lo puse pero creo que no tiene sentido

  // Si no es invitado, validar token
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