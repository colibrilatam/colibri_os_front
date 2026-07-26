import { authService } from '@/services/authService';
import { ApiError } from '@/lib/api/errors';

export const useRegister = () => {
  const handleRegister = async (formData) => {
    try {
      const data = await authService.register(formData);
      return { success: true, data };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al registrarse';
      return { success: false, error: message };
    }
  };

  return { handleRegister };
};
