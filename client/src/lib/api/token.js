import { getCookie, deleteCookie } from '../cookies.js';
import { isTokenExpired } from '../auth.js';

const TOKEN_COOKIE_NAME = 'colibri_access_token';

/**
 * Obtiene el token JWT.
 * En SSR lee cookies desde next/headers.
 * En cliente lee desde cookie del navegador.
 * @returns {Promise<string|null>}
 */
export async function getToken() {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('colibri_access_token')?.value ?? null;
  }
  // En cliente no hay nada que leer: la cookie es httpOnly.
  return null;
}
