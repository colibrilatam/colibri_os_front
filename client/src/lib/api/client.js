import axios from 'axios';
import { ApiError } from './errors.js';
import { getToken, clearToken } from './token.js';
import { generateRequestId } from './requestId.js';
import { logRequest, logResponse, logError } from './logger.js';
import { ERROR_CODES } from './types.js';

const DEFAULT_TIMEOUT = 30000;

/**
 * Instancia axios configurada con:
 * - baseURL desde NEXT_PUBLIC_BACKEND_URL
 * - Timeout de 30s por defecto
 * - Interceptor de request: inyecta token y requestId
 * - Interceptor de response: normaliza errores y maneja 401
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let logoutCallback = null;

/**
 * Registra un callback para logout automático en 401.
 * @param {() => void} callback
 */
export function setLogoutCallback(callback) {
  logoutCallback = callback;
}

apiClient.interceptors.request.use(
  async (config) => {
    const requestId = config.headers['x-request-id'] || generateRequestId();
    config.headers['x-request-id'] = requestId;
    config.metadata = { requestId, startTime: Date.now() };

    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    logRequest(requestId, config.method, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(ApiError.fromAxiosError(error));
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const { requestId, startTime } = response.config?.metadata || {};
    const duration = Date.now() - (startTime || Date.now());
    const method = response.config?.method || 'GET';
    const url = response.config?.baseURL + response.config?.url || '';
    logResponse(requestId, response.status, method, url, duration);
    return response;
  },
  async (error) => {
    if (axios.isCancel(error)) {
      throw new ApiError({
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Request cancelada',
        status: null,
        details: null,
        requestId: error.config?.metadata?.requestId || generateRequestId(),
        isNetworkError: false,
      });
    }

    const apiError = ApiError.fromAxiosError(error, error.config?.metadata?.requestId);

    const { requestId, startTime } = error.config?.metadata || {};
    const duration = Date.now() - (startTime || Date.now());

    if (apiError.status === 401) {
      clearToken();
      if (logoutCallback) {
        logoutCallback();
      }
    }

    const errMethod = error.config?.method || 'GET';
    const errUrl = error.config?.baseURL + error.config?.url || '';
    logError(requestId, apiError, errMethod, errUrl);
    logResponse(requestId, apiError.status || 'ERR', errMethod, errUrl, duration);

    throw apiError;
  }
);

export default apiClient;
