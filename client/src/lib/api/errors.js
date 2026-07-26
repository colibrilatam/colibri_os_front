import { ERROR_CODES } from './types.js';
import { generateRequestId } from './requestId.js';

/**
 * Error normalizado para todas las llamadas HTTP
 */
export class ApiError extends Error {
  /**
   * @param {Object} options
   * @param {string} options.code - Código de error normalizado
   * @param {string} options.message - Mensaje humano
   * @param {number|null} [options.status] - HTTP status code
   * @param {unknown} [options.details] - Payload del backend
   * @param {string} [options.requestId] - ID de correlación
   * @param {boolean} [options.isNetworkError] - true si es error de red
   */
  constructor({ code, message, status = null, details = null, requestId = null, isNetworkError = false }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.message = message;
    this.status = status;
    this.details = details;
    this.requestId = requestId || generateRequestId();
    this.isNetworkError = isNetworkError;
  }

  /**
   * Crea ApiError desde error de Axios
   * @param {import('axios').AxiosError} error
   * @param {string} [requestId]
   * @returns {ApiError}
   */
  static fromAxiosError(error, requestId = null) {
    const id = requestId || generateRequestId();

    if (error.response) {
      const { status, data } = error.response;
      let code = ERROR_CODES.UNKNOWN_ERROR;
      let message = 'Error en la solicitud';
      let details = data;

      if (status === 401) {
        code = ERROR_CODES.UNAUTHORIZED;
        message = 'Sesión expirada, inicie sesión para continuar';
      } else if (status === 403) {
        code = ERROR_CODES.FORBIDDEN;
        message = data?.message || 'No tiene permisos para esta acción';
      } else if (status === 404) {
        code = ERROR_CODES.NOT_FOUND;
        message = data?.message || 'Recurso no encontrado';
      } else if (status === 409) {
        code = ERROR_CODES.CONFLICT;
        message = data?.message || 'Conflicto con el estado actual';
      } else if (status === 422) {
        code = ERROR_CODES.VALIDATION_ERROR;
        message = 'Error de validación';
        details = Array.isArray(data?.message) ? data.message : data;
      } else if (status >= 500) {
        code = ERROR_CODES.SERVER_ERROR;
        message = data?.message || 'Error del servidor';
      } else if (status >= 400) {
        message = data?.message || message;
      }

      return new ApiError({
        code,
        message,
        status,
        details,
        requestId: id,
        isNetworkError: false,
      });
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return new ApiError({
        code: ERROR_CODES.TIMEOUT,
        message: 'La solicitud tardó demasiado tiempo',
        status: null,
        details: null,
        requestId: id,
        isNetworkError: true,
      });
    }

    return new ApiError({
      code: ERROR_CODES.NETWORK_ERROR,
      message: 'Error de conexión con el servidor',
      status: null,
      details: null,
      requestId: id,
      isNetworkError: true,
    });
  }

  /**
   * Crea ApiError genérico
   * @param {string} message
   * @param {string} [code]
   * @returns {ApiError}
   */
  static generic(message, code = ERROR_CODES.UNKNOWN_ERROR) {
    return new ApiError({
      code,
      message,
      status: null,
      details: null,
      requestId: generateRequestId(),
      isNetworkError: false,
    });
  }
}
