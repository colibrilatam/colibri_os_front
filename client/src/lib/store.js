import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isTokenExpired } from './auth';
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
authChecked: false,      // ← ¿ya terminamos de preguntarle al backend?
setUser: (user) => set({ user }),

checkAuth: async () => {
  try {
    const res = await userService.profile(); // withCredentials: true ya seteado
    set({ user: res, rol: res.role, authChecked: true });
    return true;
  } catch {
    set({ user: null, rol: null, authChecked: true });
    return false;
  }
},

isAuth: () => !!get().user,

      theme: null,
      setTheme: (theme) => set({ theme }),
      clearTheme: () => set({ theme: null }),

      language: 'es',
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
      
      // Token
      token: null,
      setToken: (token) => {
        set({ token });
        if (typeof window !== 'undefined') {
          if (token) {
            setCookie('token', token);
          } else {
            deleteCookie('token');
          }
        }
        // Si se establece un token, desactivar modo invitado
        set({ isGuest: false });
        deleteCookie('isGuest');
      },
      getToken: () => get().token,

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
          deleteCookie('token');
          deleteCookie('isGuest');
          resetTheme();
        }
        set({
          token: null,
          rol: null,
          user: null,
          theme: null,
          isGuest: false,
          sidebarDesktopExpanded: false,
          language: 'es',
        });
      },

      // Verificar si hay token y si es válido
      isAuthenticated: async () => {
        const token = get().token;
        if (isTokenExpired(token)) {
          //set({ token: null })
          return false;
        }
        return false;
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
