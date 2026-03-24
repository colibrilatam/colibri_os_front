export const isTokenExpired = (token) => {
  if (!token) return true  // sin token = expirado

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Date.now() / 1000
    return payload.exp < now
  } catch {
    return true
  }
}