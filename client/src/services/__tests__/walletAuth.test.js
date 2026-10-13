import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  connectWallet,
  getNonce,
  signMessage,
  verifyWalletSignature,
  getLinkNonce,
  verifyLinkSignature,
  unlinkWallet,
  getChainId,
  shortenAddress,
} from '../walletAuth.js';

vi.mock('@/lib/api', () => {
  const mockClient = {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  };
  return {
    apiClient: mockClient,
    default: mockClient,
  };
});

const providerSend = vi.fn();

vi.mock('ethers', () => {
  class BrowserProvider {
    constructor(ethereum) {
      this.ethereum = ethereum;
    }
    send(method, params) {
      return providerSend(method, params);
    }
    async getNetwork() {
      return { chainId: 1n };
    }
  }
  return { ethers: { BrowserProvider }, BrowserProvider };
});

describe('walletAuth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete window.ethereum;
  });

  describe('connectWallet', () => {
    it('throws when MetaMask is not installed', async () => {
      delete window.ethereum;
      await expect(connectWallet()).rejects.toThrow(/not installed/i);
    });

    it('returns the first account and a provider', async () => {
      window.ethereum = {};
      providerSend.mockResolvedValueOnce(['0xAbC123']);

      const { address, provider } = await connectWallet();

      expect(address).toBe('0xAbC123');
      expect(provider).toBeDefined();
      expect(providerSend).toHaveBeenCalledWith('eth_requestAccounts', []);
    });

    it('throws when no accounts are returned', async () => {
      window.ethereum = {};
      providerSend.mockResolvedValueOnce([]);

      await expect(connectWallet()).rejects.toThrow(/No accounts/i);
    });
  });

  describe('nonce + verify (login)', () => {
    it('requests a nonce from the backend', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: { message: 'siwe', nonce: '0xnonce' } });

      const result = await getNonce('0xWallet', 1);

      expect(apiClient.post).toHaveBeenCalledWith('/wallet-auth/nonce', {
        walletAddress: '0xWallet',
        chainId: 1,
      });
      expect(result).toEqual({ message: 'siwe', nonce: '0xnonce' });
    });

    it('signs the exact message returned by the backend', async () => {
      const signerSignMessage = vi.fn().mockResolvedValue('0xsignature');
      const provider = { getSigner: async () => ({ signMessage: signerSignMessage }) };

      const signature = await signMessage(provider, 'exact-backend-message');

      expect(signerSignMessage).toHaveBeenCalledWith('exact-backend-message');
      expect(signature).toBe('0xsignature');
    });

    it('sends the message + signature for verification', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: { user: { id: 'u1' } } });

      const result = await verifyWalletSignature('msg', '0xsig');

      expect(apiClient.post).toHaveBeenCalledWith('/wallet-auth/verify', {
        message: 'msg',
        signature: '0xsig',
      });
      expect(result).toEqual({ user: { id: 'u1' } });
    });
  });

  describe('link / unlink', () => {
    it('requests a link nonce', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: { message: 'siwe-link', nonce: '0x2' } });

      await getLinkNonce('0xWallet', 137);

      expect(apiClient.post).toHaveBeenCalledWith('/wallet-auth/link/nonce', {
        walletAddress: '0xWallet',
        chainId: 137,
      });
    });

    it('sends the link signature for verification', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.post.mockResolvedValueOnce({ data: { message: 'ok' } });

      await verifyLinkSignature('msg', '0xsig');

      expect(apiClient.post).toHaveBeenCalledWith('/wallet-auth/link/verify', {
        message: 'msg',
        signature: '0xsig',
      });
    });

    it('unlinks the wallet', async () => {
      const { apiClient } = await import('@/lib/api');
      apiClient.delete.mockResolvedValueOnce({ data: { message: 'unlinked' } });

      await unlinkWallet();

      expect(apiClient.delete).toHaveBeenCalledWith('/wallet-auth/unlink');
    });
  });

  describe('helpers', () => {
    it('reads the chain id from the provider', async () => {
      const provider = { getNetwork: async () => ({ chainId: 137n }) };
      await expect(getChainId(provider)).resolves.toBe(137);
    });

    it('shortens an address', () => {
      expect(shortenAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234...5678');
    });
  });
});
