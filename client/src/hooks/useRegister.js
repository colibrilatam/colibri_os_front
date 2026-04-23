import { register } from '@/services/authService'

export const useRegister = () => {

  const handleRegister = async (formData) => {
    try {
      const data = await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.username,
      })

      //localStorage.setItem('token', data.token)
      return { success: true, data }

    } catch (err) {
     
      const message = err.response?.data?.message || 'Error al registrarse'
      return { success: false, error: message }
    }
  }

  return { handleRegister }
}