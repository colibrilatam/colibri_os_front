import { useUserStore } from '@/lib/store'
import { setCookie } from '@/lib/cookies'

export const useGuestLogin = () => {
  const setIsGuest = useUserStore((state) => state.setIsGuest)
  const setRol = useUserStore((state) => state.setRol)

  const handleGuestLogin = () => {
    try {
      setIsGuest(true)
      setRol('GUEST')
      setCookie('isGuest', 'true')
      return { success: true }
    } catch (err) {
     
      return { success: false, error: 'Error al entrar como invitado' }
    }
  }

  return { handleGuestLogin }
}
