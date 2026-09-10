'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user';
import { useUserStore } from '@/lib/store';
import { ApiError } from '@/lib/api/errors';

export function useLogout(options = {}) {
  const logoutStore = useUserStore((state) => state.logout);
  const queryClient = useQueryClient();

  // Separamos el onSuccess del usuario para no pisarlo
  const { onSuccess: userOnSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn: async () => {
      // Llama al endpoint de logout (limpia la cookie en el servidor)
      const data = await userService.logout();
      return data;
    },
    onSuccess: (data, variables, context) => {
      // 1. Resetear todo el estado del usuario (store)
      logoutStore();

      // 2. Limpiar toda la caché de React Query
      queryClient.clear();

      // 3. Redirigir a login
      window.location.href = '/login';

      // 4. Llamar al onSuccess que haya pasado el usuario (si existe)
      if (userOnSuccess) {
        userOnSuccess(data, variables, context);
      }
    },
    // El resto de opciones (onError, retry, etc.) se mantienen
    ...restOptions,
  });
}

// Helper para errores (igual que en login)
export function normalizeLogoutError(error){
  console.log(error)
  return error instanceof ApiError ? error.message : 'Error al cerrar sesión';
}