const isDev = process.env.NODE_ENV === 'development';

/**
 * Elimina query strings de URLs para evitar loguear datos sensibles (ej. ?code= en OAuth)
 * @param {string} url
 * @returns {string}
 */
const stripQuery = (url) => (url ? url.split('?')[0] : '');

/**
 * Log de request saliente
 * @param {string} requestId
 * @param {string} method
 * @param {string} url
 */
export function logRequest(requestId, method, url) {
  if (!isDev) return;
  const m = (method || 'GET').toUpperCase();
  console.debug(`[API] → [${requestId}] ${m} ${stripQuery(url)}`);
}

/**
 * Log de response entrante
 * @param {string} requestId
 * @param {number} status
 * @param {string} method
 * @param {string} url
 * @param {number} duration
 */
export function logResponse(requestId, status, method, url, duration) {
  if (!isDev) return;
  const m = (method || 'GET').toUpperCase();
  const level = status >= 400 ? 'warn' : 'debug';
  console[level](`[API] ← [${requestId}] ${status} ${m} ${stripQuery(url)} (${duration}ms)`);
}

/**
 * Log de error
 * @param {string} requestId
 * @param {import('./errors.js').ApiError} error
 * @param {string} method
 * @param {string} url
 */
export function logError(requestId, error, method, url) {
  if (!isDev) return;
  const m = (method || 'GET').toUpperCase();
  console.error(`[API] ✗ [${requestId}] ${m} ${stripQuery(url)} — ${error?.code}: ${error?.message}`);
}
