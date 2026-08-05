import axios from 'axios';
import { ApiError } from './errors.js';
import { getToken, clearToken } from './token.js';
import { generateRequestId } from './requestId.js';
import { logRequest, logResponse, logError } from './logger.js';
import { ERROR_CODES } from './types.js';
import { mergeHeaders } from './headers.js';

const DEFAULT_TIMEOUT = 60000;
const MAX_RETRIES = 2;
const RETRY_DELAYS = [1000, 2000];

const RETRYABLE_CODES = [ERROR_CODES.TIMEOUT, ERROR_CODES.NETWORK_ERROR];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let logoutCallback = null;
let retryListener = null;

export function setLogoutCallback(callback) {
  logoutCallback = callback;
}

export function setRetryListener(callback) {
  retryListener = callback;
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
    /* if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } */
   // ← Toda la lógica de headers queda acá
    config.headers = mergeHeaders(config, token);

    // Agregar request-id
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

    if (config && RETRYABLE_CODES.includes(apiError.code)) {
      const method = config.method || 'GET';
      const url = config.baseURL + config.url || '';
      const requestId = config.metadata?.requestId || 'unknown';
      let retryCount = config.metadata?.retryCount || 0;

      while (retryCount < MAX_RETRIES) {
        retryCount++;
        config.metadata.retryCount = retryCount;
        config.metadata.startTime = Date.now();

        const delay = RETRY_DELAYS[retryCount - 1] || 2000;

        logError(requestId, apiError, method, url);

        if (typeof config.onRetry === 'function') {
          config.onRetry(retryCount, MAX_RETRIES);
        }
        if (typeof retryListener === 'function') {
          retryListener(true);
        }

        await sleep(delay);

        try {
          const response = await axios.request(config);
          const { startTime } = config.metadata || {};
          const duration = Date.now() - (startTime || Date.now());
          logResponse(requestId, response.status, method, url, duration);
          if (typeof retryListener === 'function') {
            retryListener(false);
          }
          return response;
        } catch (retryError) {
          if (retryCount >= MAX_RETRIES) {
            if (typeof retryListener === 'function') {
              retryListener(false);
            }
            const finalError = ApiError.fromAxiosError(retryError, requestId);
            logError(requestId, finalError, method, url);
            throw finalError;
          }
        }
      }
    }

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
