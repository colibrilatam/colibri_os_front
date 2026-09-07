import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { userService } from '@/services/user';
import { ApiError } from '@/lib/api/errors';
import { unimetTheme, bancoVenezuelaTheme } from '@/lib/themeMock';
import { useUserStore } from '@/lib/store';
import { queryKeys } from '@/lib/query-keys';

export const useLogin = () => {
  const setToken = useUserStore((state) => state.setToken);
  const setRol = useUserStore((state) => state.setRol);
  const setUser = useUserStore((state) => state.setUser);
  const [retrying, setRetrying] = useState(false);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
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
  });

  // Mantener compatibilidad con UI que mostraba estado de retry del cliente HTTP
  useEffect(() => {
    setRetrying(loginMutation.isPending);
  }, [loginMutation.isPending]);

  const handleLogin = async (formData) => {
    try {
      const result = await loginMutation.mutateAsync(formData);
      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  };

  const userData = async () => {
    try {
      const data = await userService.profile();
      return { data, error: null };
    } catch (err) {
      const error = err instanceof ApiError ? err : { message: 'Error al obtener perfil', code: 'UNKNOWN_ERROR' };
      return { data: null, error };
    }
  };

  const handleDemoLogin = async (rol) => {
    let email;
    if (rol === 'emprendedor') email = 'ana@colibri.com';
    else if (rol === 'mecenas') email = 'mecenas@colibri.com';
    else if (rol === 'mentor') email = 'mentor@colibri.com';

    try {
      const demoLoginData = await authService.login({
        email,
        password: 'Test@1234',
      });

      setToken(demoLoginData.token);
      const userData = await userService.profile();

      if (userData) {
        // userData.theme = theme;
      }
      setUser(userData);
      setRol(userData.role);
      return { data: demoLoginData, error: null };
    } catch (err) {
      const error = err instanceof ApiError ? err : { message: 'Error en login demo', code: 'UNKNOWN_ERROR' };
      return { data: null, error };
    }
  };

  return { handleLogin, userData, handleDemoLogin, retrying };
};
