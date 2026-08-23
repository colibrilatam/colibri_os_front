import { apiClient } from '@/lib/api';
import { validateResponse } from '@/lib/contracts/validate';
import { WalletNonceResponseSchema, WalletAuthResponseSchema } from '@/lib/contracts/generated';

export const walletAuthService = {
  requestNonce: async (address) => {
    const response = await apiClient.post('/auth/wallet/nonce', { address });
    return validateResponse(WalletNonceResponseSchema, response.data);
  },

  verifySignature: async (address, message, signature) => {
    const response = await apiClient.post('/auth/wallet/verify', {
      address,
      message,
      signature,
    });
    return validateResponse(WalletAuthResponseSchema, response.data);
  },
};
