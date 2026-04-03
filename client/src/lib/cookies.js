// Funciones para manejar cookies en el cliente
export const setCookie = (name, value, options = {}) => {
  const defaults = {
    path: '/',
    'max-age': 60 * 60 * 24 * 7, // 7 días
  }
  
  const settings = { ...defaults, ...options }
  let cookieString = `${name}=${encodeURIComponent(value)}`
  
  for (const [key, val] of Object.entries(settings)) {
    cookieString += `; ${key}=${val}`
  }
  
  document.cookie = cookieString
}

export const getCookie = (name) => {
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }
  
  return null
}

export const deleteCookie = (name) => {
  setCookie(name, '', { 'max-age': -1 })
}
