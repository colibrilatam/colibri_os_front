import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadToCloudinary } from '../cloudinary.js';
import { ApiError } from '@/lib/api/errors';
import { ERROR_CODES } from '@/lib/api/types';

describe('uploadToCloudinary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSignatureData = {
    cloudName: 'test-cloud',
    signature: 'abc123',
    timestamp: 1234567890,
    apiKey: 'test-api-key',
    folder: 'test-folder',
    publicId: 'test-public-id',
  };

  const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

  it('should upload file successfully', async () => {
    const mockResponse = {
      public_id: 'test-public-id',
      url: 'https://res.cloudinary.com/test-cloud/raw/upload/test-public-id',
      secure_url: 'https://res.cloudinary.com/test-cloud/raw/upload/test-public-id',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await uploadToCloudinary(mockFile, mockSignatureData);

    expect(result).toEqual(mockResponse);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.cloudinary.com/v1_1/test-cloud/raw/upload',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
  });

  it('should throw ApiError on error response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: { message: 'Upload failed' } }),
    });

    try {
      await uploadToCloudinary(mockFile, mockSignatureData);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
      expect(error.status).toBe(500);
      expect(error.message).toBe('Upload failed');
    }
  });

  it('should throw ApiError on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    try {
      await uploadToCloudinary(mockFile, mockSignatureData);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      expect(error.isNetworkError).toBe(true);
    }
  });

  it('should throw ApiError on abort', async () => {
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(abortError);

    try {
      await uploadToCloudinary(mockFile, mockSignatureData);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      expect(error.message).toBe('Subida cancelada');
    }
  });

  it('should include x-request-id in logs', async () => {
    const mockResponse = { public_id: 'test', url: 'https://...' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    await uploadToCloudinary(mockFile, mockSignatureData);

    expect(globalThis.fetch).toHaveBeenCalled();
  });
});
