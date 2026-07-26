import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';
import { generateRequestId } from '@/lib/api/requestId';
import { logRequest, logResponse, logError } from '@/lib/api/logger';

export const translationService = {
  translate: async (
    text,
    source = 'en',
    target = 'es',
  ) => {
    const requestId = generateRequestId();
    const url = '/api/translate';

    logRequest(requestId, 'POST', url);
    const startTime = Date.now();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': requestId,
        },
        body: JSON.stringify({ text, source, target }),
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new ApiError({
          code: ERROR_CODES.SERVER_ERROR,
          message: errorData.error || 'Error al traducir',
          status: response.status,
          details: errorData,
          requestId,
          isNetworkError: false,
        });
        logError(requestId, error, 'POST', url);
        throw error;
      }

      const data = await response.json();
      logResponse(requestId, response.status, 'POST', url, duration);
      return data.translation;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      const apiError = new ApiError({
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Error de conexión al traducir',
        status: null,
        details: null,
        requestId,
        isNetworkError: true,
      });
      logError(requestId, apiError, 'POST', url);
      throw apiError;
    }
  },
};
