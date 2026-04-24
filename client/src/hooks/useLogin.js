import { login } from '@/services/authService'
import { useUserStore } from '@/lib/store'
import { setCookie } from '@/lib/cookies'
import { userService } from '@/services/user'
import { authService } from '@/services/authService'
import { handleRequest } from '@/lib/handleRequest'

export const useLogin = () => {
    const setToken = useUserStore((state) => state.setToken)
    const setRol = useUserStore((state) => state.setRol)


    const handleLogin = async (formData) => {
    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
      })
      setCookie('token', data.token)
      setToken(data.token)
      const { data: userData, error: userError } = await handleRequest(() => userService.profile())
      setRol(userData.role)

      return { success: true, data }

    } catch (err) {
     
      const message = err.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, error: message }
    }
  }

  const userData = async() => {
    const { data, error } = await handleRequest(() => userService.profile())
    return { data }
  }

  const handleDemoLogin = async (rol) => {

    let email;
    if(rol === "emprendedor") email = "lucas@colibri.com"
    else if(rol === "mecenas") email = "mecenas@colibri.com"
    else if(rol === "mentor") email = "mentor@colibri.com"

    const { data: demoLoginData, error: demoLoginError } = await handleRequest(() => authService.login({
       email,
       password: "Test@1234"
    }))
    setCookie('token', demoLoginData.token)
    setToken(demoLoginData.token)
    const { data: userData, error: userError } = await handleRequest(() => userService.profile())
    setRol(userData.role)
    return { data: demoLoginData, error: demoLoginError }
  }

  
  return { handleLogin, userData, handleDemoLogin }
}

