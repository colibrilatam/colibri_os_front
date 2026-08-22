import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { userService } from '@/services/user';
import { ApiError } from '@/lib/api/errors';
import { setRetryListener } from '@/lib/api';
import { unimetTheme, bancoVenezuelaTheme } from '@/lib/themeMock';
import { useUserStore } from '@/lib/store';

export const useLogin = () => {
  const setRol = useUserStore((state) => state.setRol);
  const setUser = useUserStore((state) => state.setUser);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    setRetryListener(setRetrying);
    return () => setRetryListener(null);
  }, []);

  const handleLogin = async (formData) => {
    try {
      // El backend setea la cookie httpOnly; el frontend no recibe ni maneja el JWT.
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      const userData = await userService.profile();

      setRol(userData.role);
      if (userData) {
        if(formData.email === 'mecenas@colibri.com') userData.theme = unimetTheme;
        if(formData.email === 'BancoDV@colibri.com') userData.theme = bancoVenezuelaTheme;
      }
      setUser(userData);
      return { success: true, data: userData };
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
      await authService.login({
        email,
        password: 'Test@1234',
      });

      const userData = await userService.profile();

      if (userData) {
        // userData.theme = theme;
      }
      setUser(userData);
      setRol(userData.role);
      return { data: userData, error: null };
    } catch (err) {
      const error = err instanceof ApiError ? err : { message: 'Error en login demo', code: 'UNKNOWN_ERROR' };
      return { data: null, error };
    }
  };

  return { handleLogin, userData, handleDemoLogin, retrying };
};
