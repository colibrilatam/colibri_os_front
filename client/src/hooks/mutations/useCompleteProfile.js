'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useUserStore } from '@/lib/store';
import { ApiError } from '@/lib/api/errors';
import { queryKeys } from '@/lib/query-keys';

// Si usas Next.js, importa useRouter:
// import { useRouter } from 'next/navigation';

export function useCompleteProfile(options = {}) {
  const setUser = useUserStore((state) => state.setUser);
  const setRol = useUserStore((state) => state.setRol);
  const queryClient = useQueryClient();
  // const router = useRouter();

  return useMutation({
    mutationFn: async (formData) => {
      // formData = { tempToken, role, gender }
      const data = await authService.completeProfile(formData);

      // La respuesta del backend: { message, user }
      // Actualizamos el store con los datos del usuario (sin token)
      if (data.user) {
        setUser(data.user);
        setRol(data.user.role);
      }

      // Invalidamos la query del perfil para que se refresque
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });

      return data;
    },
    onSuccess: (data, variables, context) => {
      // Redirigir al dashboard (o donde corresponda)
      // router.push('/dashboard');
      // window.location.href = '/dashboard';

      // Llamar al onSuccess que haya pasado el consumidor
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
}

// Helper para errores
export function normalizeCompleteProfileError(error) {
  return error instanceof ApiError ? error.message : 'Error al completar el perfil';
}