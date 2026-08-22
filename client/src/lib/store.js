import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCookie, deleteCookie } from './cookies';
import { resetTheme } from './theme';
import { userService } from '@/services/user';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // Evolución de pac
      isEvolved: false,
      setIsEvolved: (isEvolved) => set({ isEvolved }),

      subioTramo: false,
      setSubioTramo: (subioTramo) => set({ subioTramo }),

      // Demo
      isDemo: false,
      setIsDemo: (isDemo) => set({ isDemo }),

      // Estado existente
      rol: 'CEO',
      setRol: (newRol) => set({ rol: newRol }),

      user: null,
      setUser: (user) => set({ user }),

      authChecked: false,
      setAuthChecked: (authChecked) => set({ authChecked }),

      // Verifica la sesión activa contra el backend (cookie httpOnly).
      checkSession: async () => {
        try {
          const userData = await userService.profile();
          set({ user: userData, rol: userData.role, authChecked: true });
          return { authenticated: true, user: userData };
        } catch {
          set({ user: null, authChecked: true });
          return { authenticated: false, user: null };
        }
      },

      theme: null,
      setTheme: (theme) => set({ theme }),
      clearTheme: () => set({ theme: null }),

      language: 'en',
      setLanguage: (language) =>
        set({
          language,
        }),

      translationsCache: {},
      setTranslation: (key, value) =>
        set((state) => ({
          translationsCache: {
            ...state.translationsCache,
            [key]: value,
          },
        })),

      getTranslation: (key) => get().translationsCache[key],

      // Guest mode
      isGuest: false,
      setIsGuest: (isGuest) => {
        set({ isGuest });
        if (typeof window !== 'undefined') {
          if (isGuest) {
            setCookie('isGuest', 'true');
          } else {
            deleteCookie('isGuest');
          }
        }
      },

      // Logout
      logout: () => {
        if (typeof window !== 'undefined') {
          deleteCookie('isGuest');
          resetTheme();
        }
        set({
          rol: null,
          user: null,
          theme: null,
          isGuest: false,
          sidebarDesktopExpanded: false,
          language: 'en',
        });
      },

      // Verificar si hay sesión activa consultando el usuario en memoria.
      // NOTA: con cookie httpOnly el frontend no puede leer el JWT;
      // para determinar si hay sesión se debe llamar a /users/profile.
      isAuthenticated: () => {
        return get().user !== null || get().isGuest === true;
      },

      // Estado del Sidebar
      sidebarMobileOpen: false,
      setSidebarMobileOpen: (isOpen) => set({ sidebarMobileOpen: isOpen }),
      toggleSidebarMobile: () =>
        set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),

      // Estado del Sidebar en Desktop (colapsado/expandido)
      sidebarDesktopExpanded: false,
      setSidebarDesktopExpanded: (isExpanded) =>
        set({ sidebarDesktopExpanded: isExpanded }),
      toggleSidebarDesktop: () =>
        set((state) => ({
          sidebarDesktopExpanded: !state.sidebarDesktopExpanded,
        })),
    }),

    {
      name: 'app-state', // key en localStorage
    },
  ),
);
