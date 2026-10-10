import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { userService } from '@/services/user';
import { ApiError } from '@/lib/api/errors';
import { unimetTheme, bancoVenezuelaTheme } from '@/lib/themeMock';
import { useUserStore } from '@/lib/store';
import { queryKeys } from '@/lib/query-keys';

export const useLogin = () => {
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

      const userData = data.user;

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

  /**
   * SEC-002: login demo sin contraseña.
   *
   * Llama a POST /auth/demo-login, que emite un token con role=demo_readonly
   * y setea la cookie HttpOnly. No hay password en el request ni en el
   * bundle del cliente.
   *
   * El rol del frontend puede llegar en español (login/page) o en inglés
   * (SelectRole emite 'entrepreneur'/'evaluator'). Se mapea al enum del
   * backend. Cualquier valor desconocido cae en 'entrepreneur'.
   */
  const DEMO_ROLE_MAP = {
    // Español (login/page.jsx)
    emprendedor: 'entrepreneur',
    mentor: 'mentor',
    evaluador: 'evaluator',
    mecenas: 'mecenas_semilla',
    // Inglés (SelectRole.jsx)
    entrepreneur: 'entrepreneur',
    evaluator: 'evaluator',
  };

  const handleDemoLogin = async (rol) => {
    const backendRole = DEMO_ROLE_MAP[rol] ?? 'entrepreneur';

    try {
      const demoLoginData = await authService.demoLogin(backendRole);

      const userData = demoLoginData.user;

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
