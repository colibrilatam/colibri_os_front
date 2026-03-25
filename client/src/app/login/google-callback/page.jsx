'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store'

export default function GoogleCallback() {
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      window.history.replaceState({}, '', window.location.pathname) // borra ?token=xxx de la URL
      setToken(token)
      router.replace('/')
    } else {
      router.replace('/login?error=google_failed')
    }
  }, [])

  return <p>Iniciando sesión...</p>
}