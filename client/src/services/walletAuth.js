import { ethers } from 'ethers';
import { apiClient } from '@/lib/api';

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found');
  }

  return { provider, address: accounts[0] };
}

export async function getNonce(walletAddress, chainId) {
  const response = await apiClient.post('/wallet-auth/nonce', {
    walletAddress,
    chainId,
  });
  return response.data;
}

export async function signMessage(provider, message) {
  const signer = await provider.getSigner();
  return await signer.signMessage(message);
}

export async function verifyWalletSignature(message, signature) {
  const response = await apiClient.post('/wallet-auth/verify', {
    message,
    signature,
  });
  return response.data;
}

export async function getLinkNonce(walletAddress, chainId) {
  const response = await apiClient.post('/wallet-auth/link/nonce', {
    walletAddress,
    chainId,
  });
  return response.data;
}

export async function verifyLinkSignature(message, signature) {
  const response = await apiClient.post('/wallet-auth/link/verify', {
    message,
    signature,
  });
  return response.data;
}

export async function unlinkWallet() {
  const response = await apiClient.delete('/wallet-auth/unlink');
  return response.data;
}

export async function getChainId(provider) {
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

export function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
