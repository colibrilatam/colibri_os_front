/**
 * QA-001: soporte de doble submit para CSRF en el cliente.
 *
 * El backend emite una cookie `csrf_token` NO HttpOnly junto con la sesión
 * HttpOnly. Aquí la leemos y la copiamos al header `X-CSRF-Token` en cada
 * request mutante. El backend rechaza con 403 si el header falta o no
 * coincide con la cookie.
 *
 * Nota: en SSR no hay `document`; esos requests usan Bearer y no necesitan
 * CSRF (no son vulnerables a CSRF).
 */

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

export function getCsrfToken() {
  if (typeof document === 'undefined' || !document.cookie) return null;

  const prefix = `${CSRF_COOKIE_NAME}=`;
  const pair = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix));

  return pair ? decodeURIComponent(pair.slice(prefix.length)) : null;
}

/**
 * Añade el header CSRF a la config de axios cuando el método es mutante y la
 * cookie está presente. Devuelve la misma config para poder encadenar.
 */
export function attachCsrfHeader(config) {
  const method = (config?.method || 'get').toLowerCase();
  if (!MUTATING_METHODS.has(method)) return config;

  const token = getCsrfToken();
  if (!token) return config;

  if (config.headers && typeof config.headers.set === 'function') {
    config.headers.set(CSRF_HEADER_NAME, token);
  } else {
    config.headers = { ...(config.headers || {}), [CSRF_HEADER_NAME]: token };
  }

  return config;
}

export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
