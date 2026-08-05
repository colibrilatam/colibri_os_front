export function mergeHeaders(config, token) {
  const headers = {
    Accept: 'application/json',
    ...(config.headers || {}),
  };

  // Authorization
  if (token && headers.Authorization == null) {
    headers.Authorization = `Bearer ${token}`;
  }

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