import { generateRequestId } from './requestId.js';
import { logRequest, logResponse, logError } from './logger.js';
import { ApiError } from './errors.js';
import { ERROR_CODES } from './types.js';

/**
 * Sube un archivo a Cloudinary usando una firma pre-generada.
 * Este es un servicio externo, por lo que usa fetch directamente
 * con FormData (no compatible con el cliente axios).
 *
 * @param {File} file - Archivo a subir
 * @param {Object} signatureData - Datos de firma del backend
 * @param {string} signatureData.cloudName
 * @param {string} signatureData.signature
 * @param {number} signatureData.timestamp
 * @param {string} signatureData.apiKey
 * @param {string} signatureData.folder
 * @param {string} signatureData.publicId
 * @param {AbortSignal} [signal] - AbortSignal para cancelación
 * @returns {Promise<{public_id: string, url: string, secure_url: string}>}
 */
export async function uploadToCloudinary(file, signatureData, signal = null) {
  const requestId = generateRequestId();
  const { cloudName, signature, timestamp, apiKey, folder, publicId } = signatureData;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

  logRequest(requestId, 'POST', url);
  const startTime = Date.now();

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('folder', folder);
    formData.append('public_id', publicId);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      signal,
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new ApiError({
        code: ERROR_CODES.SERVER_ERROR,
        message: errorData.error?.message || 'Error al subir archivo a Cloudinary',
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
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error.name === 'AbortError') {
      throw new ApiError({
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Subida cancelada',
        status: null,
        details: null,
        requestId,
        isNetworkError: false,
      });
    }

    const apiError = new ApiError({
      code: ERROR_CODES.NETWORK_ERROR,
      message: 'Error de conexión con Cloudinary',
      status: null,
      details: null,
      requestId,
      isNetworkError: true,
    });
    logError(requestId, apiError, 'POST', url);
    throw apiError;
  }
}
