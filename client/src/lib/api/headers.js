export function mergeHeaders(config) {
  const headers = {
    Accept: 'application/json',
    ...(config.headers || {}),
  };

  // La autenticación se maneja mediante cookie httpOnly;
  // no se envía token en el header Authorization.

  // Si envía FormData, dejar que el navegador genere el Content-Type
  if (config.data instanceof FormData) {
    delete headers['Content-Type'];
    delete headers['content-type'];
  } else if (
    headers['Content-Type'] == null &&
    headers['content-type'] == null
  ) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}