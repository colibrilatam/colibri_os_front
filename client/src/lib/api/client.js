import axios from 'axios';
import { ApiError } from './errors.js';
import { getToken, clearToken } from './token.js';
import { generateRequestId } from './requestId.js';
import { logRequest, logResponse, logError } from './logger.js';
import { ERROR_CODES } from './types.js';
import { mergeHeaders } from './headers.js';

const DEFAULT_TIMEOUT = 60000;

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let logoutCallback = null;

/**
 * @deprecated El retry ahora lo gestiona TanStack Query.
 * Se mantiene como no-op para no romper importaciones antiguas.
 */
export function setRetryListener() {}

export function setLogoutCallback(callback) {
  logoutCallback = callback;
}

apiClient.interceptors.request.use(
  async (config) => {
    if (!config.metadata) {
      config.metadata = {};
    }
    const requestId = config.headers['x-request-id'] || generateRequestId();
    config.headers['x-request-id'] = requestId;
    config.metadata.requestId = requestId;
    config.metadata.startTime = Date.now();

    const token = await getToken();
    config.headers = mergeHeaders(config, token);

    // Asegurar request-id después del merge
    config.headers['x-request-id'] = requestId;

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

    const config = error.config;
    const apiError = ApiError.fromAxiosError(error, config?.metadata?.requestId);

    const { requestId, startTime } = config?.metadata || {};
    const duration = Date.now() - (startTime || Date.now());

    if (apiError.status === 401) {
      clearToken();
      if (logoutCallback) {
        logoutCallback();
      }
    }

    const errMethod = config?.method || 'GET';
    const errUrl = config?.baseURL + config?.url || '';
    logError(requestId, apiError, errMethod, errUrl);
    logResponse(requestId, apiError.status || 'ERR', errMethod, errUrl, duration);

    throw apiError;
  }
);

export default apiClient;
