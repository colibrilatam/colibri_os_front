// DEPRECATED: el token JWT ahora se almacena en una cookie httpOnly
// gestionada por el backend. Estas funciones se mantienen vacías para
// compatibilidad con imports existentes durante la transición.

/**
 * @returns {Promise<null>}
 */
export async function getToken() {
  return null;
}

/**
 * @param {string} _token
 */
export function setToken(_token) {
  // No-op: el backend setea la cookie httpOnly.
}

/**
 */
export function clearToken() {
  // No-op: el backend limpia la cookie httpOnly mediante /auth/logout.
}
