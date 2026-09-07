'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { userService } from '@/services/user';
import { useUserStore } from '@/lib/store';
import { ApiError } from '@/lib/api/errors';
import { unimetTheme, bancoVenezuelaTheme } from '@/lib/themeMock';
import { queryKeys } from '@/lib/query-keys';

export function useLogin(options = {}) {
  const setToken = useUserStore((state) => state.setToken);
  const setRol = useUserStore((state) => state.setRol);
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const data = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      setToken(data.token);

      const userData = await userService.profile();

      if (userData) {
        if (formData.email === 'mecenas@colibri.com') userData.theme = unimetTheme;
        if (formData.email === 'BancoDV@colibri.com') userData.theme = bancoVenezuelaTheme;
      }

      setRol(userData.role);
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });

      return { ...data, user: userData };
    },
    ...options,
  });
}

export function normalizeLoginError(error) {
  return error instanceof ApiError ? error.message : 'Error al iniciar sesión';
}
