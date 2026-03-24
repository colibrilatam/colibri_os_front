import { login } from '@/services/authService'
import { useUserStore } from '@/lib/store'

export const useLogin = () => {
    const setToken = useUserStore((state) => state.setToken)

    const handleLogin = async (formData) => {
    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
      })

      localStorage.setItem('token', data.token)
      setToken(data.token)
      return { success: true, data }

    } catch (err) {
        console.log(err)
      const message = err.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, error: message }
    }
  }

  return { handleLogin }
}