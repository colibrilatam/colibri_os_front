/**
 * @typedef {Object} ApiError
 * @property {string} code - Código de error normalizado (ej. "UNAUTHORIZED", "VALIDATION_ERROR", "NETWORK_ERROR", "TIMEOUT", "UNKNOWN_ERROR")
 * @property {string} message - Mensaje humano del error
 * @property {number|null} status - HTTP status code (null para errores de red)
 * @property {unknown} [details] - Payload del backend o detalles adicionales
 * @property {string} requestId - ID de correlación para trazabilidad
 * @property {boolean} isNetworkError - true si es error de red/timeout
 */

/**
 * @typedef {Object} ApiResponse
 * @property {unknown} data - Datos de la respuesta
 * @property {number} status - HTTP status code
 * @property {string} requestId - ID de correlación
 * @property {number} duration - Duración en ms
 */

/**
 * @typedef {Object} RequestConfig
 * @property {string} [method] - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @property {string} url - URL del endpoint (relativa a baseURL)
 * @property {unknown} [data] - Body de la request
 * @property {Object} [params] - Query parameters
 * @property {Object} [headers] - Headers adicionales
 * @property {AbortSignal} [signal] - AbortSignal para cancelación
 * @property {number} [timeout] - Timeout en ms
 */

/**
 * @typedef {Object} ClientInstance
 * @property {(url: string, config?: RequestConfig) => Promise<ApiResponse>} get
 * @property {(url: string, data?: unknown, config?: RequestConfig) => Promise<ApiResponse>} post
 * @property {(url: string, data?: unknown, config?: RequestConfig) => Promise<ApiResponse>} put
 * @property {(url: string, data?: unknown, config?: RequestConfig) => Promise<ApiResponse>} patch
 * @property {(url: string, config?: RequestConfig) => Promise<ApiResponse>} delete
 */

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};
