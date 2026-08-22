import { authService } from '@/services/authService';
import { userService } from '@/services/user';
import { ApiError } from '@/lib/api/errors';

export const useRegister = () => {
  const handleRegister = async (formData) => {
    try {
      // El backend setea la cookie httpOnly; el frontend no recibe ni maneja el JWT.
      const data = await authService.register(formData);
      const userData = await userService.profile();
      return { success: true, data: { ...data, user: userData } };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al registrarse';
      return { success: false, error: message };
    }
  };

  return { handleRegister };
};
