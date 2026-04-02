import { useUserStore } from '@/lib/store'

export const useGuestLogin = () => {
  const setIsGuest = useUserStore((state) => state.setIsGuest)
  const setRol = useUserStore((state) => state.setRol)

  const handleGuestLogin = () => {
    try {
      setIsGuest(true)
      setRol('GUEST')
      return { success: true }
    } catch (err) {
      console.log(err)
      return { success: false, error: 'Error al entrar como invitado' }
    }
  }

  return { handleGuestLogin }
}
